import { Uri } from "../Uri";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { IUser } from "../Types";
import { UserModel } from "../models/Models";
import jwtDecode from "jwt-decode";
import { OAuth2Client } from "google-auth-library";
// import { TelegramBot } from "node-telegram-bot-api";

const client = new OAuth2Client();

export async function authenticateToken(req: any, res: Response, next: any) {
  let accessToken: string = req.headers["accesstoken"];
  if (accessToken) {
    try {
      const token = jwtDecode(accessToken);
      /**
       * This condition to handle sso google auth
       */
      if (token["sub"]) {
        const ticket = await client.verifyIdToken({
          idToken: accessToken,
          audience: Uri.googleClientId
        });

        const payload = ticket.getPayload();
        if (payload) {
          return next();
        } else {
          return res.send({
            status: 403,
            error: true,
            message: 'Error token invalid signature'
          });
        }
      } else {
        await jwt.verify(accessToken, Uri.secretKey, async (err: any, result: any) => {
          console.log("Error name access token", err);
          if (err) {
            if (err.name.includes("TokenExpiredError")) {
              // console.log("Return token expired error");
              return res.send({
                status: 403,
                error: true,
                message: "TokenExpiredError",
              });
            } else {
              return res.send({
                status: 403,
                error: true,
                message: 'Error token invalid signature'
              });
            }
          } else {
            return next();
          }
        });

      }
    } catch (error: any) {
      console.log(error);
    }
  } else {
    return res.send({
      status: 403,
      error: true,
      message: "Token doesn't exist"
    })
  }
}

export function textFormat(string: string, keyValuePairs: any): string {
  if (Object.keys(keyValuePairs).length == 0) return string;
  Object.keys(keyValuePairs).map((key) => {
    string.replace(`{${key}}`, keyValuePairs[key])
  });
  return string;
}

/**
 * Send notification Telegram Bot
 */
// export async function sendNotification(message: string, keyValuePair: any, userId: string) {
//   try {
//     const user: IUser = await UserModel.findOne<IUser>({ id: userId });
//     console.log(user);
//     if (user) {
//       if (user?.notification?.token && user?.notification?.chatId) {

//         const token = user.notification.token;
//         const chatId = user.notification.token.split("#").pop();

//         const msg = textFormat(message, keyValuePair);

//         const bot = new TelegramBot(token, { polling: true });
//         bot.on('message', (msg) => {
//           console.log("msg", msg);
//         });
//         bot.sendMessage(chatId, msg);

//         return ({
//           error: false,
//           status: 200,
//           message: "Send notification successfully"
//         })
//       } else {
//         return ({
//           error: true,
//           status: 404,
//           message: "Chat ID and Conversation Toket doesn't exists"
//         });
//       }
//     } else {
//       console.log("User is not found");
//       return ({
//         error: true,
//         status: 404,
//         message: "User doesn't exists"
//       });
//     }
//   } catch (error) {
//     return ({
//       error: true,
//       status: 500,
//       message: error
//     });
//   }
// }
