import UserModel from "../model/user.model.ts";

export type GoogleLoginResult =
  | { isNewUser: false; user: Awaited<ReturnType<UserModel["fetchUserByEmail"]>> }
  | { isNewUser: true; email: string; name: string };

export default class AuthService {
  private userModel = new UserModel();

  loginWithGoogle = async (profile?: any): Promise<GoogleLoginResult> => {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error("Google account did not return an email.");
    }

    const existingUser = await this.userModel.fetchUserByEmail(email);

    if (existingUser) {
      return { isNewUser: false, user: existingUser };
    }

    return {
      isNewUser: true,
      email,
      name: profile?.displayName ?? "",
    };
  };
}
