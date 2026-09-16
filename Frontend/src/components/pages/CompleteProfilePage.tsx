"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { decodeSignupToken } from "@/lib/auth";

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [signupToken, setSignupToken] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams?.get("signupToken");
    const storedToken = sessionStorage.getItem("signupToken");
    const token = tokenFromUrl || storedToken;

    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeSignupToken(token);
    if (!payload?.email || !payload.isNewUser) {
      router.replace("/login");
      return;
    }

    setSignupToken(token);
    setGoogleEmail(payload.email);
    setGoogleName(payload.name ?? "");
    sessionStorage.setItem("signupToken", token);
  }, [searchParams, router]);

  if (!signupToken || !googleEmail) {
    return (
      <div className="page-center">
        <div className="loader" />
        <p>Preparing your profile...</p>
      </div>
    );
  }

  return (
    <div className="page-center login-page">
      <div className="card login-card login-card-wide">
        <div className="login-icon">👋</div>
        <h1>Complete Your Profile</h1>
        <p className="muted">
          Welcome! Your Google account is verified. Add your details to create
          your account.
        </p>

        <RegisterForm
          initialName={googleName}
          initialEmail={googleEmail}
          emailReadOnly
          submitLabel="Create Account & Continue"
          onSubmit={async (values) => {
            const response = await api.registerFromGoogle(signupToken, values);
            sessionStorage.removeItem("signupToken");
            await login(response.token);
            router.replace("/");
          }}
        />
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="page-center">
          <div className="loader" />
          <p>Preparing your profile...</p>
        </div>
      }
    >
      <CompleteProfileContent />
    </Suspense>
  );
}
