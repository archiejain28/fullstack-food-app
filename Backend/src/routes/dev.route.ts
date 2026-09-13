import express from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.model.ts";

const router = express.Router();
const userModel = new UserModel();

router.get("/login", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({ message: "Not found" });
    return;
  }

  try {
    const email = "demo@foodapp.com";
    let user = await userModel.fetchUserByEmail(email);

    if (!user) {
      user = await userModel.createUser({
        name: "Demo User",
        email,
        address: "221B Baker Street",
        phone_no: "9876543210",
        role: "CUSTOMER",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3001";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    res.status(500).json({
      message: "Dev login failed",
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default router;
