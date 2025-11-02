import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined!');
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  console.log('Attempting to connect to database...');
  if (cached.conn) {
    console.log('Using cached database connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      console.log('Establishing new database connection...');
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Database connected successfully!');
        return mongoose;
      });
    } catch (error) {
      cached.promise = null;
      console.error("Mongoose connection error (synchronous):", error);
      throw error;
    }
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;