const mongoose = require("mongoose");
const { MongoClientOptions } = require("mongodb");
const { Uri } = require("../Uri");

async function Connection() {
  try {
    const connectionString: string = Uri.dbUri + Uri.dbName;
    mongoose.set('strictQuery', false)
    const connection = await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true } as any);
    connection.connection;
    console.log("Success connected to database");
  } catch (error) {
    console.log("Failure connected to database", error);
    process.exit();
  }

}

export default Connection;