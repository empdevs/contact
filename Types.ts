import { ObjectId } from "mongodb";

export interface IContact {
  _id: ObjectId,
  name: string,
  phone: number
}

export interface IUser {
  _id: ObjectId,
  username: string,
  password: string
}

export interface ITokenInfo {
  userId: ObjectId,
  username: string,
  aud: string,
}