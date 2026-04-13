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
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  budget: { type: Number, required: true },
  imageUrl: { type: String, default: null },

  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'PAID', 'CANCELLED'],
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
  },
  escrow_status: {
    type: String,
    enum: ["none", "locked", "released", "refunded"],
    default: "none"
  },
  escrow_amount: {
    type: Number,
    default: 0
  },
  payment_confirmed_poster: {
    type: Boolean,
    default: false
  },
  payment_confirmed_helper: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
