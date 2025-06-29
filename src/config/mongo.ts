import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('✅ MongoDB connected');
};
