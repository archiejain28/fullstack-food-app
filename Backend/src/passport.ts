import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import AuthService from "./services/auth.service.ts";

const authService = new AuthService();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await authService.loginWithGoogle(profile);
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);
