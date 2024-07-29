import { Document } from "mongodb";

export interface IContact extends Document {
  id: string,
  name: string,
  phone: number
}
export interface IUser extends Document {
  id: string,
  username: string,
  password: string,
  notification?: {
    token: string,
    chatId: string
  }
}

export interface ITokenInfo extends Document {
  userId: string,
  username: string,
}

export interface ITokenData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}