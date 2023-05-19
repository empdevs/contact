import jwtDecode, { JwtPayload } from "jwt-decode";
import { Uri } from "../Uri";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ITokenInfo } from "../Types";
import { RefreshTokenModel } from "../models/Models";

export async function authenticateToken(req: any, res: Response, next: any) {
  const accessToken: string | any = req.headers["accesstoken"];
  if (accessToken) {
    //  Automatic validation
    let validToken: string | any = accessToken;
    let count = 0;
    let isValid: boolean = true;
    try {
      do {

        await jwt.verify(validToken, Uri.secretKey, async (err: any, result: any) => {
          console.log("Error access token", err);
          if (err && err.name == "TokenExpiredError") {
            validToken = await refreshToken(validToken);
            if (validToken == "REFRESH_TOKEN_EXPIRED") {
              return res.send({
                status: 403,
                error: true,
                body: {
                  message: "Refresh token has expirated",
                  reason: "REFRESH_TOKEN_EXPIRED"
                }
              });
            }
            isValid = false;
            count++;
          } else {
            const decodeToken: any = result;
            const intendedAudienceURL = Uri.rootUri;
            // console.log(decodeToken)
            if (!!!decodeToken)
              return;
            if (decodeToken.aud !== intendedAudienceURL) {
              return res.send({
                status: 403,
                error: true,
                body: {
                  message: "The aud do not match in the access token",
                  reason: "AUD_NOT_MATCH",
                }
              });
            }
            if (count !== 0)
              req["accessToken"] = validToken;
            isValid = true;
            return next();
          }
        });
      } while (!!!isValid);
      // } while (false);
    } catch (error: any) {
      console.log(error);
    }
  } else {
    return res.send({
      status: 403,
      error: true,
      body: {
        message: "Token doesn't exist",
        reason: "NO_TOKEN",
      }
    })
  }
}

export async function refreshToken(accessToken: string) {
  const userInfo: ITokenInfo | any = jwt.decode(accessToken);
  let refreshTokenItem = await RefreshTokenModel.findOne({ userId: userInfo.userId });
  // console.log(refreshTokenItem);
  const refreshToken = refreshTokenItem?.refreshToken!;
  await jwt.verify(refreshToken, Uri.secretKeyRefresh, (err: any, result: any) => {
    console.log("Error refresh token", err)
    if (err && err.name == "TokenExpiredError") return ("REFRESH_TOKEN_EXPIRED");

  })
  const tokenInfo: ITokenInfo = {
    userId: userInfo.userId,
    username: userInfo.username,
    aud: 'http://localhost'
  }
  const newAccessToken = jwt.sign(tokenInfo, Uri.secretKey, { expiresIn: '1h' });
  // console.log("new access token", newAccessToken);
  return (newAccessToken);
}