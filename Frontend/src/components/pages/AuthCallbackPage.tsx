"use client";



import { useRouter, useSearchParams } from "next/navigation";

import { Suspense, useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";



function AuthCallbackContent() {

  const searchParams = useSearchParams();

  const router = useRouter();

  const { login } = useAuth();

  const [error, setError] = useState("");



  useEffect(() => {

    const token = searchParams?.get("token");



    if (!token) {

      setError("Authentication failed. No token received.");

      return;

    }



    login(token)
      .then(() => router.replace("/"))
      .catch(() => {
        setError("Failed to complete login. Please try again.");
      });

  }, [searchParams, login, router]);



  if (error) {

    return (

      <div className="page-center">

        <div className="card login-card">

          <h2>Login Error</h2>

          <p className="error-text">{error}</p>

          <button className="btn btn-primary" onClick={() => router.push("/login")}>

            Back to Login

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="page-center">

      <div className="loader" />

      <p>Signing you in...</p>

    </div>

  );

}



export default function AuthCallbackPage() {

  return (

    <Suspense

      fallback={

        <div className="page-center">

          <div className="loader" />

          <p>Signing you in...</p>

        </div>

      }

    >

      <AuthCallbackContent />

    </Suspense>

  );

}


