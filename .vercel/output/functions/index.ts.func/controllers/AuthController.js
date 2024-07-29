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
exports.refreshToken = exports.login = void 0;
const Models_1 = require("../models/Models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Uri_1 = require("../Uri");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            if (username && password) {
                let item = yield Models_1.UserModel.findOne({ username: username });
                if (item) {
                    const passwordIsValid = bcryptjs_1.default.compareSync(password, item.password);
                    if (!!!passwordIsValid) {
                        return res.send({
                            status: 401,
                            error: true,
                            message: "Password is wrong",
                            data: null,
                        });
                    }
                    const tokenInfo = {
                        userId: item.id,
                        username: item.username,
                    };
                    // create token
                    const accessToken = jsonwebtoken_1.default.sign(tokenInfo, Uri_1.Uri.secretKey, { expiresIn: '1h' });
                    const refreshToken = jsonwebtoken_1.default.sign(tokenInfo, Uri_1.Uri.secretKeyRefresh, { expiresIn: '30d' });
                    const refreshTokenItem = yield Models_1.RefreshTokenModel.findOne({ userId: item.id });
                    if (!!!refreshTokenItem)
                        yield Models_1.RefreshTokenModel.create({ userId: item.id, refreshToken: refreshToken });
                    return res.send({
                        status: 201,
                        error: false,
                        message: "Login successfully",
                        data: {
                            id: item.id,
                            username: item.username,
                            accessToken: accessToken
                        }
                    });
                }
                else {
                    return res.send({
                        status: 401,
                        error: true,
                        message: "Username or password is wrong"
                    });
                }
            }
            else {
                return res.send({
                    status: 401,
                    error: true,
                    message: "Username and password doesn't exist"
                });
            }
        }
        catch (error) {
            // console.log(error.response)
            return res.send({
                status: 401,
                error: true,
                message: error.message
            });
        }
    });
}
exports.login = login;
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = req.body["accessToken"];
        if (!!!accessToken) {
            return res.send({
                status: 403,
                error: true,
                message: "Access token doesn't exists"
            });
        }
        const userInfo = jsonwebtoken_1.default.decode(accessToken);
        const refreshTokenItem = yield Models_1.RefreshTokenModel.findOne({ userId: userInfo.userId });
        if (!!!refreshTokenItem) {
            return res.send({
                status: 404,
                error: true,
                message: "Refresh token doesn't exist"
            });
        }
        ;
        const refreshToken = refreshTokenItem === null || refreshTokenItem === void 0 ? void 0 : refreshTokenItem.refreshToken;
        yield jsonwebtoken_1.default.verify(refreshToken, Uri_1.Uri.secretKeyRefresh, (err, result) => __awaiter(this, void 0, void 0, function* () {
            console.log("Error refresh token", err);
            console.log("Error name refresh token", err === null || err === void 0 ? void 0 : err.name);
            if (err) {
                switch (err.name) {
                    case "TokenExpiredError":
                        yield Models_1.RefreshTokenModel.deleteOne({ userId: userInfo.userId });
                        return res.send({
                            status: 404,
                            error: true,
                            message: "Refresh token expired"
                        });
                        break;
                    default:
                        return res.send({
                            status: 500,
                            error: true,
                            message: "Refresh token error"
                        });
                        break;
                }
            }
            else {
                const tokenInfo = {
                    userId: userInfo.userId,
                    username: userInfo.username,
                };
                const newAccessToken = jsonwebtoken_1.default.sign(tokenInfo, Uri_1.Uri.secretKey, { expiresIn: '1h' });
                return res.send({
                    status: 200,
                    error: false,
                    message: "Access token is successfully refreshed ",
                    data: newAccessToken
                });
            }
        }));
        return (res);
    });
}
exports.refreshToken = refreshToken;
//# sourceMappingURL=AuthController.js.map