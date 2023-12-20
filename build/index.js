"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ContactRouter_1 = __importDefault(require("./routers/ContactRouter"));
const AuthRouter_1 = __importDefault(require("./routers/AuthRouter"));
const Database_1 = __importDefault(require("./configuration/Database"));
const body_parser_1 = __importDefault(require("body-parser"));
const Uri_1 = require("./Uri");
const helper_1 = require("./helper/helper");
const app = (0, express_1.default)();
const port = Number(Uri_1.Uri.serverPort) || 3000;
(0, Database_1.default)();
// CORS is a mechanism to tell the browser, whether a request that is
// dispatched from another web application domain or another origin, to our web application is allowed or not.
app.use((0, cors_1.default)());
// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express_1.default.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/api/auth/', AuthRouter_1.default);
app.use('/api/contact/', helper_1.authenticateToken, ContactRouter_1.default);
app.use('*', (req, res) => {
    res.json({ msg: 'no route handler found' }).end();
});
//server running
app.listen(port, () => {
    // await Connection();
    console.log(`Server running at port ${port} `);
});
//# sourceMappingURL=index.js.map