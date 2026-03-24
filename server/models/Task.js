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
    enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'PAID'],
    default: 'OPEN'
  },
  helper: {
    name: String,
    rating: String,
    reviews: Number
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
