import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Logging for every request (to see what's happening)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('GigB API is running!');
});

const PORT = process.env.PORT || 5000;

// Detailed MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ CONNECTED TO MONGODB ATLAS');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('❌ MONGODB CONNECTION ERROR:', error.message);
    console.error('Stack Trace:', error.stack);
  });
