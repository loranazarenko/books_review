import mongoose from 'mongoose';
import { useEnv } from './useEnv';

export async function connectDB(): Promise<void> {
  const { MONGO_ADDRESS } = useEnv();
  
  try {
    await mongoose.connect(MONGO_ADDRESS);
    console.log('✔ Connected to MongoDB at', MONGO_ADDRESS);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('✔ Disconnected from MongoDB');
}