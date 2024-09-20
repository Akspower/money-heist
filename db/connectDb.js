const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);

    const connectionInstance = mongoose.connection;

    connectionInstance.on("connected", () => {
      console.log(
        `\nDatabase connected!! DB_HOST -> ${connectionInstance.host}`
      );
    });

    connectionInstance.on("error", (error) => {
      console.error("MongoDB connection FAILED", error);
    });

  } catch (error) {
    console.error("Error connecting to database", error);
    throw error; // Rethrow the error for further handling
  }
};

module.exports = connectDB;
