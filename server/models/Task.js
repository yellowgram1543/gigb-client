import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'COMPLETED'],
    default: 'OPEN'
  },
  helper: {
    name: String,
    rating: String,
    reviews: Number
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

const Task = mongoose.model('Task', taskSchema);

export default Task;
