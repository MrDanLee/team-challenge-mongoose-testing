const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async() =>  {
  try {
    await mongoose.connect(MONGO_URI)
  } catch (error) {
    console.error(error);
  }
}

module.exports = dbConnection;