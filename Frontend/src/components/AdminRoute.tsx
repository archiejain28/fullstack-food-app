"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/roles";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
      return;
    }

    if (!loading && user && !isAdmin(user)) {
      router.replace("/");
    }
  }, [loading, token, user, router]);

  if (loading) {
    return (
      <div className="page-center">
        <div className="loader" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!token || !user || !isAdmin(user)) {
    return null;
  }

  return children;
}
