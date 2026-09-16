import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
import type { UserType } from "../types/user.types.ts";
import type { GoogleLoginResult } from "../services/auth.service.ts";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const result = req.user as GoogleLoginResult;
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3001";

    if (result.isNewUser) {
      const signupToken = jwt.sign(
        {
          email: result.email,
          name: result.name,
          isNewUser: true,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" },
      );

      res.redirect(
        `${frontendUrl}/complete-profile?signupToken=${signupToken}`,
      );
      return;
    }

    const user = result.user as UserType;
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  },
);

router.get("/logout", (req, res) => {
  res.json({
    status: true,
    message: "Logged out successfully",
  });
});

export default router;
