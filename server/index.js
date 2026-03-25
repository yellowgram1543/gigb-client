import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, replace with your Vercel URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (taskId) => {
    socket.join(taskId);
    console.log(`User joined room: ${taskId}`);
  });

  socket.on('send_message', async (data) => {
    const { taskId, sender, text, senderName } = data;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Save to DB
    const newMessage = new Message({ taskId, sender, text, senderName, time });
    await newMessage.save();

    // Broadcast to the room
    io.to(taskId).emit('receive_message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Get chat history for a task
app.get('/api/messages/:taskId', async (req, res) => {
  try {
    const messages = await Message.find({ taskId: req.params.taskId }).sort({ createdAt: 1 });
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
