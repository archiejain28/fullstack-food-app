import type { Request, Response, NextFunction } from "express";
import jwt  from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken";
import { HttpStatus } from "../constant.ts";
import * as STRING from "../string.ts";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const webToken = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : "";
    if (!webToken || webToken == "") {
      res.status(401).json({
        status: HttpStatus.UNAUTHORIZED,
        message: STRING.AUTHORIZATION_FAILED,
      });
      return;
    }

    const decoded = await jwt.verify(webToken!, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: HttpStatus.UNAUTHORIZED,
      message: STRING.AUTHORIZATION_FAILED,
    });
  }
};
