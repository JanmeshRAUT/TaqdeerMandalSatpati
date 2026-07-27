import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in .env');
    }

    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
        console.log(`MongoDB Connected successfully`);
        return mongooseInstance;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    // Do not process.exit(1) in serverless, let it throw so Vercel can retry or show proper error
    throw error;
  }
};

export default connectDB;

