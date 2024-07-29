"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.textFormat = exports.authenticateToken = void 0;
const Uri_1 = require("../Uri");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Models_1 = require("../models/Models");
const node_telegram_bot_api_1 = require("node-telegram-bot-api");
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = req.headers["accesstoken"];
        if (accessToken) {
            try {
                yield jsonwebtoken_1.default.verify(accessToken, Uri_1.Uri.secretKey, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    console.log("Error name access token", err);
                    if (err) {
                        if (err.name.includes("TokenExpiredError")) {
                            // console.log("Return token expired error");
                            return res.send({
                                status: 403,
                                error: true,
                                message: "TokenExpiredError",
                            });
                        }
                        else {
                            return res.send({
                                status: 403,
                                error: true,
                                message: 'Error token invalid signature'
                            });
                        }
                    }
                    else {
                        return next();
                    }
                }));
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            return res.send({
                status: 403,
                error: true,
                message: "Token doesn't exist"
            });
        }
    });
}
exports.authenticateToken = authenticateToken;
function textFormat(string, keyValuePairs) {
    if (Object.keys(keyValuePairs).length == 0)
        return string;
    Object.keys(keyValuePairs).map((key) => {
        string.replace(`{${key}}`, keyValuePairs[key]);
    });
    return string;
}
exports.textFormat = textFormat;
/**
 * Send notification Telegram Bot
 */
function sendNotification(message, keyValuePair, userId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield Models_1.UserModel.findOne({ id: userId });
            console.log(user);
            if (user) {
                if (((_a = user === null || user === void 0 ? void 0 : user.notification) === null || _a === void 0 ? void 0 : _a.token) && ((_b = user === null || user === void 0 ? void 0 : user.notification) === null || _b === void 0 ? void 0 : _b.chatId)) {
                    const token = user.notification.token;
                    const chatId = user.notification.token.split("#").pop();
                    const msg = textFormat(message, keyValuePair);
                    const bot = new node_telegram_bot_api_1.TelegramBot(token, { polling: true });
                    bot.on('message', (msg) => {
                        console.log("msg", msg);
                    });
                    bot.sendMessage(chatId, msg);
                    return ({
                        error: false,
                        status: 200,
                        message: "Send notification successfully"
                    });
                }
                else {
                    return ({
                        error: true,
                        status: 404,
                        message: "Chat ID and Conversation Toket doesn't exists"
                    });
                }
            }
            else {
                console.log("User is not found");
                return ({
                    error: true,
                    status: 404,
                    message: "User doesn't exists"
                });
            }
        }
        catch (error) {
            return ({
                error: true,
                status: 500,
                message: error
            });
        }
    });
}
exports.sendNotification = sendNotification;
//# sourceMappingURL=helper.js.map