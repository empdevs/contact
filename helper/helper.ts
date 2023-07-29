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
          console.log("Error name access token", err?.name);
          if (err) {
            switch (err.name) {
              case "TokenExpiredError":
                validToken = await refreshToken(validToken);
                console.log(validToken);
                if (validToken == "REFRESH_TOKEN_EXPIRED") {
                  return res.send({
                    status: 403,
                    error: true,
                    body: {
                      message: "Refresh token has expired",
                      reason: "REFRESH_TOKEN_EXPIRED"
                    }
                  });
                }
                if (validToken == "REFRESH_TOKEN_INVALID_SIGNATURE") {
                  return res.send({
                    status: 403,
                    error: true,
                    body: {
                      message: "Refresh Token Invalid Signature",
                      reason: "INVALID_SIGNATURE"
                    }
                  });
                }
                break;
              default:
                return res.send({
                  status: 403,
                  error: true,
                  body: {
                    message: "Error Token Invalid Signature",
                    reason: "INVALID_SIGNATURE"
                  }
                });
                break;
            }
            isValid = false;
            count++;
          } else {
            const decodeToken: any = result;
            const intendedAudienceURL = Uri.rootUri;
            // console.log(decodeToken)
            if (!!!decodeToken) return;
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

            if (count !== 0) req["accessToken"] = validToken;
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
  const refreshTokenItem = await RefreshTokenModel.findOne({ userId: userInfo.userId });
  const refreshToken = refreshTokenItem?.refreshToken!;
  let res: string = "";
  await jwt.verify(refreshToken, Uri.secretKeyRefresh, async (err: any, result: any) => {
    console.log("Error refresh token", err)
    console.log("Error name refresh token", err?.name)
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          await RefreshTokenModel.deleteOne({ userId: userInfo.userId })
          res = "REFRESH_TOKEN_EXPIRED";
          break;
        default:
          res = "REFRESH_TOKEN_INVALID_SIGNATURE";
          break;
      }
    } else {
      const tokenInfo: ITokenInfo = {
        userId: userInfo.userId,
        username: userInfo.username,
        aud: Uri.rootUri
      }
      const newAccessToken = jwt.sign(tokenInfo, Uri.secretKey, { expiresIn: '1h' });
      // console.log("new access token", newAccessToken);
      res = newAccessToken;
    }
  });
  return (res);
}