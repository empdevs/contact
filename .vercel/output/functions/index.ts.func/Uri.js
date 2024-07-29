"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uri = void 0;
require("dotenv/config");
class Uri {
    static get rootUri() { return process.env["ROOT_URI"] || ""; }
    static get serverPort() { return process.env["PORT"] || ""; }
    static get dbUri() { return process.env["DB_URI"] || ""; }
    static get dbName() { return process.env["DB_NAME"] || ""; }
    static get secretKey() { return process.env["SECRET_KEY_TOKEN"] || ""; }
    static get secretKeyRefresh() { return process.env["SECRET_KEY_REFRESH"] || ""; }
}
exports.Uri = Uri;
//# sourceMappingURL=Uri.js.map