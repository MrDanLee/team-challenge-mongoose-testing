const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async() =>  {
  if (process.env.NODE_ENV === "test") return;
  try {
    await mongoose.connect(MONGO_URI)
  } catch (error) {
    console.error(error);
  }
}

module.exports = dbConnection;