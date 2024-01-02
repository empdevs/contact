import { Request, Response } from "express";
import { ContactModel, UserModel } from "../models/Models";
import { IContact, IUser } from "../Types";
import { v4 as uuidv4 } from "uuid";
import { sendNotification, textFormat } from "../helper/helper";

interface IRequest extends Request {
  accessToken?: string
}

export async function getAllData(req: IRequest, res: Response, next: any) {
  try {
    console.log("request", req["accessToken"]);
    // console.log("response", res)
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
  // const userId = req.params.userId;
  // const username = req.params.username;
  try {
    const insertData: IContact = await data.save();
    // const message = "{username} created new contact";
    // const users: IUser[] = await UserModel.find(
    //   {
    //     id: { $ne: userId }
    //   }
    // );
    // console.log(users);
    // for (const user of users) {
    //   await sendNotification(message, { username: username }, user.id);
    // }
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

  console.log(req)
  const id = req.params.id
  try {
    await ContactModel.updateOne({ id: id }, { $set: req.body });
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