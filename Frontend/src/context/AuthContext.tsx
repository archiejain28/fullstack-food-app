"use client";



import {

  createContext,

  useCallback,

  useContext,

  useEffect,

  useMemo,

  useState,

  type ReactNode,

} from "react";

import { api } from "@/lib/api";

import type { User } from "@/types";



type AuthContextValue = {

  user: User | null;

  token: string | null;

  loading: boolean;

  login: (token: string) => Promise<void>;

  logout: () => void;

  refreshProfile: () => Promise<void>;

};



const AuthContext = createContext<AuthContextValue | null>(null);



export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);



  const refreshProfile = useCallback(async () => {

    const profile = await api.getProfile();

    setUser(profile);

  }, []);



  const login = useCallback(

    async (newToken: string) => {

      localStorage.setItem("token", newToken);

      setToken(newToken);

      await refreshProfile();

    },

    [refreshProfile],

  );



  const logout = useCallback(() => {

    localStorage.removeItem("token");

    setToken(null);

    setUser(null);

  }, []);



  useEffect(() => {

    const storedToken = localStorage.getItem("token");

    setToken(storedToken);



    if (!storedToken) {

      setLoading(false);

    }

  }, []);



  useEffect(() => {

    if (!token) return;



    refreshProfile()

      .catch(() => {

        logout();

      })

      .finally(() => {

        setLoading(false);

      });

  }, [token, refreshProfile, logout]);



  const value = useMemo(

    () => ({ user, token, loading, login, logout, refreshProfile }),

    [user, token, loading, login, logout, refreshProfile],

  );



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}



export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error("useAuth must be used within AuthProvider");

  }

  return context;

}


