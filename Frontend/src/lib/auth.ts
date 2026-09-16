export type SignupTokenPayload = {
  email: string;
  name: string;
  isNewUser?: boolean;
};

export function decodeSignupToken(token: string): SignupTokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded as SignupTokenPayload;
  } catch {
    return null;
  }
}
