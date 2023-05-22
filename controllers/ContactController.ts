// import { Request, Response } from "express";
const { ContactModel } = require("../models/Models");
const { IContact } = require("../Types");

interface IRequest extends Request {
  accessToken?: string
}

export async function getAllData(req: any, res: any, next: any) {
  try {
    // console.log(req)
    const data: any[] = await ContactModel.find();
    res.send({
      status: 200,
      error: false,
      body: {
        item: data,
        accessToken: req.accessToken
      },
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      status: 400,
      error: true,
      body: {
        message: error.message
      }
    });
  }
}

export async function createData(req: any, res: any) {
  const data = new ContactModel(req.body);
  try {
    const insertData: any = await data.save();
    res.send({
      status: 201,
      error: false,
      body: {
        item: insertData,
        accessToken: req.accessToken
      }
    });
  } catch (error: any) {
    res.send({
      status: 401,
      error: true,
      body: {
        message: error.message
      }
    });
  }
}

//This function is includes partial update if needed
export async function updateData(req: any, res: any) {
  const id = req.params.id
  try {
    await ContactModel.updateOne({ _id: id }, { $set: req.body });
    res.send({
      status: 201,
      error: false,
      body: {
        message: "Success update data",
        accessToken: req.accessToken
      }
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      status: 401,
      error: true,
      body: {
        message: error.message
      }
    });
  }
}

export async function deleteData(req: any, res: any) {
  const id = req.params.id
  try {
    await ContactModel.deleteOne({ _id: id });
    res.send({
      status: 201,
      error: false,
      body: {
        message: "Success delete data",
        accessToken: req.accessToken
      }
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      status: 401,
      error: true,
      body: {
        message: error.message
      }
    });
  }
}