import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.model.ts";
import type { UserType } from "../types/user.types.ts";
import {
  completeProfileSchema,
  registerSchema,
} from "../validators/user.validator.ts";

export default class UserController {
  userModel = new UserModel();

  register = async (req: Request, res: Response) => {
    try {
      const { value, error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: false,
          message: error.details[0]?.message,
        });
      }

      const { name, address, phone_no, role, email } = value;
      const existingUser = await this.userModel.fetchUserByEmail(email);

      if (existingUser) {
        return res.status(409).json({
          status: false,
          message:
            "This email is already registered. Please sign in with Google.",
        });
      }

      const user = await this.userModel.createUser({
        name,
        email,
        address,
        phone_no,
        role,
      });

      res.status(201).json({
        status: true,
        message:
          "Account created successfully. Please sign in with Google using the same email.",
        data: user,
      });
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

  registerFromGoogle = async (req: Request, res: Response) => {
    try {
      const signupToken =
        (req.headers.authorization?.split(" ")[1] as string) ||
        (req.body.signupToken as string);

      if (!signupToken) {
        return res.status(401).json({
          status: false,
          message: "Signup token is required",
        });
      }

      const decoded = jwt.verify(
        signupToken,
        process.env.JWT_SECRET!,
      ) as { email: string; name: string; isNewUser?: boolean };

      if (!decoded.isNewUser) {
        return res.status(401).json({
          status: false,
          message: "Invalid signup token",
        });
      }

      const { value, error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: false,
          message: error.details[0]?.message,
        });
      }

      const { name, address, phone_no, role, email } = value;

      if (email !== decoded.email) {
        return res.status(400).json({
          status: false,
          message: "Email must match your Google account",
        });
      }

      const existingUser = await this.userModel.fetchUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          status: false,
          message: "Account already exists. Please sign in with Google.",
        });
      }

      const user = await this.userModel.createUser({
        name,
        email,
        address,
        phone_no,
        role,
      });

      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" },
      );

      res.status(201).json({
        status: true,
        message: "Account created successfully",
        token,
        data: user,
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          status: false,
          message: "Signup session expired. Please sign in with Google again.",
        });
      }

      res.status(500).json({
        status: false,
        message: "Something went wrong while creating your account",
      });
    }
  };

  completeProfile = async (req: Request, res: Response) => {
    try {
      const { value, error } = completeProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: false,
          message: error.details[0]?.message,
        });
      }

      const { email } = req.user as UserType;
      const { name, address, phone_no, role } = value;

      const updatedProfile = await this.userModel.completeUserProfile(
        email,
        name,
        address,
        phone_no,
        role,
      );

      res.status(200).json({
        status: true,
        message: "Profile completed successfully",
        data: updatedProfile,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong while completing profile",
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
