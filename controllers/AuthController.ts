// import { Request, Response } from "express";
const { RefreshTokenModel, UserModel } = require("../models/Models");
const { ITokenInfo, IUser } = require("../Types");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Uri } = require("../Uri");


export async function login(req: any, res: any) {

  const { username, password }: string | any = req.body;

  // try {
  if (username && password) {
    let item: any[] | any = await UserModel.find({ username: username });
    if (item.length > 0) {
      item = item[0];
      const passwordIsValid: boolean = bcrypt.compareSync(password, item.password);
      if (!!!passwordIsValid) {
        res.send({
          status: 201,
          error: true,
          body: {
            message: "Username or password incorect"
          }
        })
      };
      // token info includes user info
      const tokenInfo: any = {
        userId: item._id,
        username: item.username,
        aud: 'http://localhost'
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
        data: {
          id: item._id,
          username: item.username,
          accessToken: accessToken
        }
      });
    } else {
      return res.send({
        status: 201,
        error: false,
        data: null
      });
    }
  } else {
    return res.send({
      status: 400,
      error: true,
      message: "Username dan password doesn't exist"
    });
  }
  // } catch (error: any) {
  //   // console.log(error.response)
  //   return res.send({
  //     status: 401,
  //     error: true,
  //     message: error.message
  //   });
  // }

}