import type { Request, Response, NextFunction } from "express";
import { roles } from "../constant.ts";
import type { UserType } from "../types/user.types.ts";

export const isLoggedUserAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { role } = req.user as UserType

  if (role == roles.ADMIN) {
    next();
  } else {
    res.status(401).json({
      message: "Only Admins can perform this action",
    });
    throw new Error("Only Admins can perform this action");
  }
};
