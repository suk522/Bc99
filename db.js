
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = `mongodb+srv://sukhdevgodara964:${process.env.DB_PASSWORD}@cluster0.fil5pj9.mongodb.net/`;
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
