import UserModel from "../model/user.model.ts";

export default class AuthService {
  private userModel = new UserModel();

  loginWithGoogle = async (profile?: any) => {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error("Google account did not return an email.");
    }
    // Check if user exists in your database
    const res = await this.userModel.fetchUserByEmail(email);

    if (!res) {
      const newUser = await this.userModel.createUser({
        name: profile?.displayName,
        email: email,
        address: "",
        phone_no: "5677",
        role: "Customer",
      });
      return newUser;
    }

    return res;
  };
}
