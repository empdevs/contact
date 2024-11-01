import mongoose, { ConnectOptions } from "mongoose";
import { Uri } from "../Uri";

async function Connection() {
  try {
    const connectionString: string = `${Uri.dbUri}/${Uri.dbName}`;
    mongoose.set('strictQuery', false)
    const connection = await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
    connection.connection;
    console.log("Success connected to database");
  } catch (error) {
    console.log("Failure connected to database", error);
    process.exit();
  }

}

export default Connection;