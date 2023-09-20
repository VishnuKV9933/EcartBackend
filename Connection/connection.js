const mongoose = require('mongoose');
const dotenv =require("dotenv")
dotenv.config();

const mongoDBURL = 'mongodb://username:password@host:port/database';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToDatabase;