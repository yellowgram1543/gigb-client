import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';
dotenv.config();

async function create() {
  await mongoose.connect(process.env.MONGO_URI);
  const task = await Task.create({
    title: "Injection Test Task",
    description: "Testing field whitelist logic",
    address: "789 Secure Ln",
    location: { lat: 12.9, lng: 77.5 },
    budget: 200,
    posterId: "test-user-id-123",
    status: "OPEN",
    escrow_status: "none"
  });
  console.log(`TASK_ID=${task._id}`);
  process.exit(0);
}
create();
