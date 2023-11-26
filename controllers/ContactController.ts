import { Request, Response } from "express";
import { ContactModel } from "../models/Models";
import { IContact } from "../Types";
import { v4 as uuidv4 } from "uuid";

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
      message: "Success get data",
      data: data,
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      status: 400,
      error: true,
      message: error.message
    });
  }
}

export async function createData(req: IRequest, res: Response) {
  const data = new ContactModel({ id: uuidv4(), ...req.body });
  try {
    const insertData: IContact = await data.save();
    res.send({
      status: 201,
      error: false,
      message: "Success create data",
      data: insertData
    });
  } catch (error: any) {
    res.send({
      status: 401,
      error: true,
      message: error.message
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
      message: "Success update data",
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      status: 401,
      error: true,
      message: error.message
    });
  }
}

export async function deleteData(req: IRequest, res: Response) {
  const id = req.params.id
  try {
    await ContactModel.deleteOne({ id: id });
    res.send({
      status: 201,
      error: false,
      message: "Success delete data",
    });
  } catch (error: any) {
    console.log(error);
    res.send({
      status: 401,
      error: true,
      message: error.message
    });
  }
}