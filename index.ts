import express, { Application } from "express";

const app: Application = express();
const port: number = 3000;

//server running
app.listen(port, () => {

  console.log(`Server running at port ${port} `);

});