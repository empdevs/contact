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
exports.refreshToken = exports.authenticateToken = void 0;
const Uri_1 = require("../Uri");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Models_1 = require("../models/Models");
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = req.headers["accesstoken"];
        if (accessToken) {
            //  Automatic validation
            let validToken = accessToken;
            let count = 0;
            let isValid = true;
            try {
                do {
                    yield jsonwebtoken_1.default.verify(validToken, Uri_1.Uri.secretKey, (err, result) => __awaiter(this, void 0, void 0, function* () {
                        console.log("Error access token", err);
                        console.log("Error name access token", err === null || err === void 0 ? void 0 : err.name);
                        if (err) {
                            switch (err.name) {
                                case "TokenExpiredError":
                                    validToken = yield refreshToken(validToken);
                                    console.log(validToken);
                                    if (validToken == "REFRESH_TOKEN_EXPIRED") {
                                        return res.send({
                                            status: 403,
                                            error: true,
                                            body: {
                                                message: "Refresh token has expired",
                                                reason: "REFRESH_TOKEN_EXPIRED"
                                            }
                                        });
                                    }
                                    if (validToken == "REFRESH_TOKEN_INVALID_SIGNATURE") {
                                        return res.send({
                                            status: 403,
                                            error: true,
                                            body: {
                                                message: "Refresh Token Invalid Signature",
                                                reason: "INVALID_SIGNATURE"
                                            }
                                        });
                                    }
                                    break;
                                default:
                                    return res.send({
                                        status: 403,
                                        error: true,
                                        body: {
                                            message: "Error Token Invalid Signature",
                                            reason: "INVALID_SIGNATURE"
                                        }
                                    });
                                    break;
                            }
                            isValid = false;
                            count++;
                        }
                        else {
                            const decodeToken = result;
                            const intendedAudienceURL = Uri_1.Uri.rootUri;
                            // console.log(decodeToken)
                            if (!!!decodeToken)
                                return;
                            if (decodeToken.aud !== intendedAudienceURL) {
                                return res.send({
                                    status: 403,
                                    error: true,
                                    body: {
                                        message: "The aud do not match in the access token",
                                        reason: "AUD_NOT_MATCH",
                                    }
                                });
                            }
                            if (count !== 0)
                                req["accessToken"] = validToken;
                            isValid = true;
                            return next();
                        }
                    }));
                } while (!!!isValid);
                // } while (false);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            return res.send({
                status: 403,
                error: true,
                body: {
                    message: "Token doesn't exist",
                    reason: "NO_TOKEN",
                }
            });
        }
    });
}
exports.authenticateToken = authenticateToken;
function refreshToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = jsonwebtoken_1.default.decode(accessToken);
        const refreshTokenItem = yield Models_1.RefreshTokenModel.findOne({ userId: userInfo.userId });
        const refreshToken = refreshTokenItem === null || refreshTokenItem === void 0 ? void 0 : refreshTokenItem.refreshToken;
        let res = "";
        yield jsonwebtoken_1.default.verify(refreshToken, Uri_1.Uri.secretKeyRefresh, (err, result) => __awaiter(this, void 0, void 0, function* () {
            console.log("Error refresh token", err);
            console.log("Error name refresh token", err === null || err === void 0 ? void 0 : err.name);
            if (err) {
                switch (err.name) {
                    case "TokenExpiredError":
                        yield Models_1.RefreshTokenModel.deleteOne({ userId: userInfo.userId });
                        res = "REFRESH_TOKEN_EXPIRED";
                        break;
                    default:
                        res = "REFRESH_TOKEN_INVALID_SIGNATURE";
                        break;
                }
            }
            else {
                const tokenInfo = {
                    userId: userInfo.userId,
                    username: userInfo.username,
                    aud: 'http://localhost'
                };
                const newAccessToken = jsonwebtoken_1.default.sign(tokenInfo, Uri_1.Uri.secretKey, { expiresIn: '1h' });
                // console.log("new access token", newAccessToken);
                res = newAccessToken;
            }
        }));
        return (res);
    });
}
exports.refreshToken = refreshToken;
//# sourceMappingURL=helper.js.map