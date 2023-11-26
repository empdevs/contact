import { Request, Response } from "express";
import { RefreshTokenModel, UserModel } from "../models/Models";
import { ITokenInfo, IUser } from "../Types";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Uri } from "../Uri";
// import { Redis } from "ioredis";

// export const redis: any = new Redis();
// async function hashPassword(password: string) {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// }

export async function login(req: Request, res: Response) {

  const { username, password }: string | any = req.body;

  try {
    if (username && password) {
      let item: IUser[] | IUser = await UserModel.find({ username: username });
      if (item.length > 0) {
        item = item[0];
        const passwordIsValid: boolean = bcrypt.compareSync(password, item.password);
        if (!!!passwordIsValid) {
          return res.send({
            status: 401,
            error: true,
            message: "Password is wrong",
            data: null,
          });
        }
        // token info includes user info
        const tokenInfo: ITokenInfo = {
          userId: item._id,
          username: item.username,
          aud: Uri.rootUri
        }
        // create token
        const accessToken = jwt.sign(tokenInfo, Uri.secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign(tokenInfo, Uri.secretKeyRefresh, { expiresIn: '30d' });

        const refreshTokenItem = await RefreshTokenModel.find({ userId: item._id });
        if (refreshTokenItem.length == 0) {
          await RefreshTokenModel.create({ userId: item._id, refreshToken: refreshToken });
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
      } else {
        return res.send({
          status: 401,
          error: true,
          message: "Username or password is wrong"
        });
      }
    } else {
      return res.send({
        status: 401,
        error: true,
        message: "Username and password doesn't exist"
      });
    }
  } catch (error: any) {
    // console.log(error.response)
    return res.send({
      status: 401,
      error: true,
      message: error.message
    });
  }

}