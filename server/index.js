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
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors()); 
app.use(express.json()); 

// Socket.io Logic with Debugging
io.on('connection', (socket) => {
  console.log('DEBUG: Socket Connected:', socket.id);

  socket.on('join_room', (taskId) => {
    socket.join(taskId);
    console.log(`DEBUG: Socket ${socket.id} joined room: ${taskId}`);
  });

  socket.on('send_message', async (data) => {
    console.log('DEBUG: Message Received:', data);
    const { taskId, sender, text, senderName } = data;
    
    try {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Save to DB
      const newMessage = new Message({ 
        taskId, 
        sender: sender === "anonymous" ? new mongoose.Types.ObjectId() : sender, // Fallback for testing
        text, 
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
    }
  });

  socket.on('disconnect', () => {
    console.log('DEBUG: Socket Disconnected');
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

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
