const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;