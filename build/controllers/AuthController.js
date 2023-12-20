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
exports.login = void 0;
const Models_1 = require("../models/Models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Uri_1 = require("../Uri");
// import { Redis } from "ioredis";
// export const redis: any = new Redis();
// async function hashPassword(password: string) {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// }
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            if (username && password) {
                let item = yield Models_1.UserModel.find({ username: username });
                if (item.length > 0) {
                    item = item[0];
                    const passwordIsValid = bcryptjs_1.default.compareSync(password, item.password);
                    if (!!!passwordIsValid) {
                        return res.send({
                            status: 401,
                            error: true,
                            message: "Password is wrong",
                            data: null,
                        });
                    }
                    // token info includes user info
                    const tokenInfo = {
                        userId: item._id,
                        username: item.username,
                        aud: Uri_1.Uri.rootUri
                    };
                    // create token
                    const accessToken = jsonwebtoken_1.default.sign(tokenInfo, Uri_1.Uri.secretKey, { expiresIn: '1h' });
                    const refreshToken = jsonwebtoken_1.default.sign(tokenInfo, Uri_1.Uri.secretKeyRefresh, { expiresIn: '30d' });
                    const refreshTokenItem = yield Models_1.RefreshTokenModel.find({ userId: item._id });
                    if (refreshTokenItem.length == 0) {
                        yield Models_1.RefreshTokenModel.create({ userId: item._id, refreshToken: refreshToken });
                    }
                    return res.send({
                        status: 201,
                        error: false,
                        message: "Login successful",
                        data: {
                            id: item._id,
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
//# sourceMappingURL=AuthController.js.map