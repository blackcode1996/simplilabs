import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || '');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};


export { connectMongoDB };
