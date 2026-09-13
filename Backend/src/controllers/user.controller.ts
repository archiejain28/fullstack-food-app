import type { Request, Response } from "express";
import UserModel from "../model/user.model.ts";
import type { UserType } from "../types/user.types.ts";
import { userSchema } from "../validators/user.validator.ts";

export default class UserController {
  userModel = new UserModel();

  register = async (req: Request, res: Response) => {
    try {
      const { value, error } = userSchema.validate(req.body);
      const { name, address, phone_no, role, email } = value;

      if (error) {
        throw new Error(error?.details[0]?.message);
      }

      const user = await this.userModel.createUser({
        name,
        email,
        address,
        phone_no,
        role,
      }); // to access instance's method/properties, we need to use this keyword

      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          status: false,
          message: error.message,
        });
      }
      res.status(500).json({
        status: false,
        message: "Something went wrong",
      });
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const fetchData = await this.userModel.fetchAllUsers();
      res.status(200).json(fetchData);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong while creating user",
      });
    }
  };

  getUserProfile = async (req: Request, res: Response) => {
    try {
      const { email } = req.user as UserType;
      const fetchData = await this.userModel.fetchUserByEmail(email);
      res.status(200).json(fetchData);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong while creating user",
      });
    }
  };

  updateUserProfile = async (req: Request, res: Response) => {
    try {
      const { email, role } = req.user as UserType;
      const { id } = req.params;
      const { address, phone_no, newRole } = req.body;

      const updatedProfile = await this.userModel.updateUserField(
        address ?? null,
        phone_no ?? null,
        newRole ?? null,
        email ?? null,
        id as string ?? null
      );
      res.status(200).json({
        message: "Profile updated sucessfully",
        data: updatedProfile,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Something went wrong while updating user",
      });
    }
  };
}
