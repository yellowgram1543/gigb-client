import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

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
router.post('/', async (req, res) => {
  const { title, description, address, budget, location } = req.body;

  const newTask = new Task({ title, description, address, budget, location });

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
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Returns the updated document
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
