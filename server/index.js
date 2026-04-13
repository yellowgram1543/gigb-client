import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import Message from './models/Message.js';
import Task from './models/Task.js';
import protect from './middleware/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors()); 
app.use(express.json()); 

// Socket.io Logic with Debugging
io.on('connection', (socket) => {
  console.log('DEBUG: Socket Connected:', socket.id);

  socket.on('join_room', async ({ taskId, userId }) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return socket.emit("error", { message: "Task not found" });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return socket.emit("error", { message: "Task not found" });
      }

      // Check if the user is the poster or the assigned helper
      if (userId !== task.posterId && userId !== task.helperId) {
        return socket.emit("error", { message: "Not authorized" });
      }

      socket.join(taskId);
      console.log(`DEBUG: Socket ${socket.id} joined room: ${taskId}`);
    } catch (error) {
      console.error('DEBUG ERROR: Join room failed:', error.message);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on('send_message', async (data) => {
    console.log('DEBUG: Message Received:', data);
    const { taskId, senderId, content, senderName } = data;
    
    try {
      if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return socket.emit("error", { message: "Task not found" });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return socket.emit("error", { message: "Task not found" });
      }

      // Check if the sender is the poster or the assigned helper
      if (senderId !== task.posterId && senderId !== task.helperId) {
        return socket.emit("error", { message: "Not authorized" });
      }

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Save to DB
      const newMessage = new Message({ 
        taskId, 
        sender: senderId, 
        text: content, 
        senderName, 
        time 
      });
      
      await newMessage.save();
      console.log('DEBUG: Message Saved to DB');

      // Broadcast to the room
      io.to(taskId).emit('receive_message', newMessage);
      console.log(`DEBUG: Message Emitted to Room ${taskId}`);
    } catch (error) {
      console.error('DEBUG ERROR: Failed to save/send message:', error.message);
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on('disconnect', () => {
    console.log('DEBUG: Socket Disconnected');
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/messages/:taskId', protect, async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate ObjectId format to ensure 404 instead of 500 on cast errors
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Check if the user is the poster or the assigned helper
    if (req.user._id.toString() !== task.posterId && req.user._id.toString() !== task.helperId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const messages = await Message.find({ taskId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('GigB API with Socket.io is running!');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ CONNECTED TO MONGODB ATLAS');
    httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('❌ MONGODB CONNECTION ERROR:', error.message);
  });
