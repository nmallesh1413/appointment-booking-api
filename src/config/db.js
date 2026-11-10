const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connectDB() {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGO_URI is missing. Add it to your .env file.");
    }

    const memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri();
    process.env.MONGO_URI = mongoUri;
    mongoose.memoryServer = memoryServer;
  }

  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}

module.exports = connectDB;
