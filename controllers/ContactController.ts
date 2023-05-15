import { Request, Response } from "express";
import { ContactModel } from "../models/Models";
import { IContact } from "../Types";

interface IRequest extends Request {
  accessToken?: string
}

export async function getAllData(req: IRequest, res: Response, next: any) {
  try {
    // console.log(req)
    const data: IContact[] = await ContactModel.find();
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

export async function createData(req: IRequest, res: Response) {
  const data = new ContactModel(req.body);
  try {
    const insertData: IContact = await data.save();
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
export async function updateData(req: IRequest, res: Response) {
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

export async function deleteData(req: IRequest, res: Response) {
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