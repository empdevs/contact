import mongoose from "mongoose";
import { MongoClientOptions } from "mongodb";
import { Uri } from "../Uri";

async function Connection() {
  const stringConnection: string = `${Uri.dbUri}/${Uri.dbName}`;
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