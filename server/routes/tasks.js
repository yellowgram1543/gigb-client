import express from 'express';
import Task from '../models/Task.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Helper function to release escrow
const releaseEscrow = (task) => {
  task.escrow_status = "released";
  task.status = "COMPLETED";
  console.log(`Escrow released: ₹${task.escrow_amount} to helper for task #${task._id}`);
};

// 1. GET ALL TASKS
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET A SINGLE TASK BY ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE A NEW TASK
router.post('/', protect, async (req, res) => {
  const { title, description, address, budget, location, imageUrl } = req.body;

  const newTask = new Task({ 
    title, 
    description, 
    address, 
    budget, 
    location, 
    imageUrl,
    posterId: req.user._id 
  });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

// 4. UPDATE A TASK (e.g., change status to ASSIGNED or COMPLETED)
router.patch('/:id', async (req, res) => {
  try {
    console.log("DEBUG: Incoming PATCH body:", req.body);
    // Whitelist of fields allowed to be updated via this route
    const allowedFields = ["title", "description", "budget", "category", "location", "scheduledAt", "address", "imageUrl"];
    
    // Filter req.body to only include allowed fields
    const filteredBody = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });
    
    console.log("DEBUG: Filtered body for update:", filteredBody);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      filteredBody, 
      { new: true } // Returns the updated document
    );
    
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. ACCEPT A GIG (Assign helper and lock escrow)
router.patch('/:id/accept', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = 'ASSIGNED';
    if (req.body.helper) {
      task.helper = req.body.helper;
    }
    
    // Escrow logic
    task.escrow_amount = task.budget;
    task.escrow_status = 'locked';

    const updatedTask = await task.save();
    
    console.log(`Escrow locked: ₹${updatedTask.escrow_amount} for task #${updatedTask._id}`);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. POSTER CONFIRMS WORK DONE
router.patch('/:id/confirm-poster', protect, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only posters can confirm this action' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.payment_confirmed_poster = true;

    if (task.payment_confirmed_helper) {
      releaseEscrow(task);
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. HELPER CONFIRMS COMPLETION
router.patch('/:id/confirm-helper', protect, async (req, res) => {
  try {
    if (req.user.role !== 'helper') {
      return res.status(403).json({ message: 'Only helpers can confirm this action' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.payment_confirmed_helper = true;

    if (task.payment_confirmed_poster) {
      releaseEscrow(task);
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. POSTER REFUNDS ESCROW
router.patch('/:id/refund', protect, async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only posters can initiate a refund' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.escrow_status !== 'locked') {
      return res.status(400).json({ message: 'Refund only allowed if escrow is locked' });
    }

    task.escrow_status = 'refunded';
    task.status = 'CANCELLED';

    const updatedTask = await task.save();
    
    console.log(`Escrow refunded: ₹${updatedTask.escrow_amount} to poster for task #${updatedTask._id}`);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
