"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = exports.UserModel = exports.ContactModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
exports.ContactModel = mongoose_1.default.model('contacts', new mongoose_1.default.Schema({
<<<<<<< HEAD
    id: {
        type: String,
        required: true
    },
=======
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
}));
exports.UserModel = mongoose_1.default.model('users', new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}));
exports.RefreshTokenModel = mongoose_1.default.model('refresh_tokens', new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}));
//# sourceMappingURL=Models.js.map