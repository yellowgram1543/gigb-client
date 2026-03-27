import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  senderName: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
