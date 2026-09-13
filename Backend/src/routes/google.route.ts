import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
import type { UserType } from "../types/user.types.ts";

const router = express.Router();

// it will done in browser.

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback URL for handling the OAuth 2.0 response
router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user as UserType;

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3001";
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  },
);

// Logout route
router.get("/logout", (req, res) => {
  res.json({
    status: true,
    message: "Logged out successfully",
  });
});

export default router;
