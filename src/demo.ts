import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  process.env.JWT_KEY = "demojwtkey";

  let mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening to port 3000.");
  });
};

start();
