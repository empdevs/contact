const express = require("express");
const cors = require("cors");
const { ContactRouter } = require('./routers/ContactRouter')
const { AuthRouter } = require('./routers/AuthRouter')
const { Connection } = require('./configuration/Database')
const bodyParser = require("body-parser");
const { Uri } = require("./Uri");
const { authenticateToken } = require("./helper/helper");

const app: any = express();
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
app.use('/api/auth/', AuthRouter);
app.use('/api/contact/', authenticateToken, ContactRouter);
//server running

app.listen(port, () => {
  // await Connection();
  console.log(`Server running at port ${port} `);

});