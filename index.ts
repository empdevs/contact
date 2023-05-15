import express, { Application } from "express";
import cors from 'cors';
import ContactRouter from './routers/ContactRouter';
import AuthRouter from './routers/AuthRouter';
import Connection from "./configuration/Database";
import bodyParser from "body-parser";
import { Uri } from "./Uri";
import { authenticateToken } from "./helper/helper";

const app: Application = express();
const port: number = Number(Uri.serverPort);

Connection();
// CORS is a mechanism to tell the browser, whether a request that is
// dispatched from another web application domain or another origin, to our web application is allowed or not.
app.use(cors());

// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/auth/', AuthRouter)
app.use('/api/contact/', authenticateToken, ContactRouter)
//server running

app.listen(port, () => {
  // await Connection();
  console.log(`Server running at port ${port} `);

});