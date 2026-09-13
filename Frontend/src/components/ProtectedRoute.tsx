"use client";



import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";



export default function ProtectedRoute({

  children,

}: {

  children: React.ReactNode;

}) {

  const { token, loading } = useAuth();

  const router = useRouter();



  useEffect(() => {

    if (!loading && !token) {

      router.replace("/login");

    }

  }, [loading, token, router]);



  if (loading) {

    return (

      <div className="page-center">

        <div className="loader" />

        <p>Loading...</p>

      </div>

    );

  }



  if (!token) {

    return null;

  }



  return children;

}


