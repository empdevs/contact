import mongoose from "mongoose";
import { MongoClientOptions } from "mongodb";
import { Uri } from "../Uri";

async function Connection() {
  // const stringConnection: string = `${Uri.dbUri}/${Uri.dbName}`;
  const stringConnection: string = `mongodb+srv://arifrozikinh:WzRgtTTqpUEau8Qm@contact.k46fnau.mongodb.net/?retryWrites=true&w=majority`;
  try {
    mongoose.set('strictQuery', false)
    const connection = await mongoose.connect(stringConnection, { useNewUrlParser: true, useUnifiedTopology: true } as MongoClientOptions)
    connection.connection;
    console.log("Success connected to database");
  } catch (error) {
    console.log("Failure connected to database", error);
    process.exit();
  }

}

export default Connection;