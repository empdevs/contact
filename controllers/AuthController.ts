import { Request, Response } from "express";
import { RefreshTokenModel, UserModel } from "../models/Models";
import { ITokenInfo, IUser } from "../Types";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Uri } from "../Uri";

export async function login(req: Request, res: Response) {

  const { username, password }: string | any = req.body;
  try {
    if (username && password) {
      let item: IUser = await UserModel.findOne<IUser>({ username: username });
      if (item) {
        const passwordIsValid: boolean = bcrypt.compareSync(password, item.password);
        if (!!!passwordIsValid) {
          return res.send({
            status: 401,
            error: true,
            message: "Password is wrong",
            data: null,
          });
        }

        const tokenInfo: ITokenInfo = {
          userId: item.id,
          username: item.username,
        }

        // create token
        const accessToken = jwt.sign(tokenInfo, Uri.secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign(tokenInfo, Uri.secretKeyRefresh, { expiresIn: '30d' });

        const refreshTokenItem = await RefreshTokenModel.findOne({ userId: item.id });
        if (!!!refreshTokenItem) await RefreshTokenModel.create({ userId: item.id, refreshToken: refreshToken });

        return res.send({
          status: 201,
          error: false,
          message: "Login successfully",
          data: {
            id: item.id,
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

export async function refreshToken(req: Request, res: Response) {
  const accessToken = req.body["accessToken"];
  if (!!!accessToken) {
    return res.send({
      status: 403,
      error: true,
      message: "Access token doesn't exists"
    });
  }

  const userInfo: ITokenInfo = jwt.decode(accessToken);
  const refreshTokenItem = await RefreshTokenModel.findOne({ userId: userInfo.userId });
  if (!!!refreshTokenItem) {
    return res.send({
      status: 404,
      error: true,
      message: "Refresh token doesn't exist"
    })
  };

  const refreshToken = refreshTokenItem?.refreshToken!;
  await jwt.verify(refreshToken, Uri.secretKeyRefresh, async (err: any, result: any) => {
    console.log("Error refresh token", err)
    console.log("Error name refresh token", err?.name)
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          await RefreshTokenModel.deleteOne({ userId: userInfo.userId })
          return res.send({
            status: 404,
            error: true,
            message: "Refresh token expired"
          })
          break;
        default:
          return res.send({
            status: 500,
            error: true,
            message: "Refresh token error"
          });
          break;
      }
    } else {
      const tokenInfo: ITokenInfo = {
        userId: userInfo.userId,
        username: userInfo.username,
      }
      const newAccessToken = jwt.sign(tokenInfo, Uri.secretKey, { expiresIn: '1h' });
      return res.send({
        status: 200,
        error: false,
        message: "Access token is successfully refreshed ",
        data: newAccessToken
      })
    }
  });
  return (res);

}