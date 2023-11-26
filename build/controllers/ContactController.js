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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteData = exports.updateData = exports.createData = exports.getAllData = void 0;
const Models_1 = require("../models/Models");
<<<<<<< HEAD
const uuid_1 = require("uuid");
=======
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
function getAllData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log(req)
            const data = yield Models_1.ContactModel.find();
            res.send({
                status: 200,
                error: false,
<<<<<<< HEAD
                message: "Success get data",
                data: data,
=======
                body: {
                    item: data,
                    accessToken: req.accessToken
                },
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
        catch (error) {
            console.log(error);
            res.send({
                status: 400,
                error: true,
<<<<<<< HEAD
                message: error.message
=======
                body: {
                    message: error.message
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
    });
}
exports.getAllData = getAllData;
function createData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
<<<<<<< HEAD
        const data = new Models_1.ContactModel(Object.assign({ id: (0, uuid_1.v4)() }, req.body));
=======
        const data = new Models_1.ContactModel(req.body);
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
        try {
            const insertData = yield data.save();
            res.send({
                status: 201,
                error: false,
<<<<<<< HEAD
                message: "Success create data",
                data: insertData
=======
                body: {
                    item: insertData,
                    accessToken: req.accessToken
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
        catch (error) {
            res.send({
                status: 401,
                error: true,
<<<<<<< HEAD
                message: error.message
=======
                body: {
                    message: error.message
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
    });
}
exports.createData = createData;
//This function is includes partial update if needed
function updateData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            yield Models_1.ContactModel.updateOne({ _id: id }, { $set: req.body });
            res.send({
                status: 201,
                error: false,
<<<<<<< HEAD
                message: "Success update data",
=======
                body: {
                    message: "Success update data",
                    accessToken: req.accessToken
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
        catch (error) {
            console.log(error);
            res.send({
                status: 401,
                error: true,
<<<<<<< HEAD
                message: error.message
=======
                body: {
                    message: error.message
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
    });
}
exports.updateData = updateData;
function deleteData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
<<<<<<< HEAD
            yield Models_1.ContactModel.deleteOne({ id: id });
            res.send({
                status: 201,
                error: false,
                message: "Success delete data",
=======
            yield Models_1.ContactModel.deleteOne({ _id: id });
            res.send({
                status: 201,
                error: false,
                body: {
                    message: "Success delete data",
                    accessToken: req.accessToken
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
        catch (error) {
            console.log(error);
            res.send({
                status: 401,
                error: true,
<<<<<<< HEAD
                message: error.message
=======
                body: {
                    message: error.message
                }
>>>>>>> 7eb8faa4392244e864d1ac6c3a9bdb25d3b2c91a
            });
        }
    });
}
exports.deleteData = deleteData;
//# sourceMappingURL=ContactController.js.map