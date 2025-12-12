"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  accessToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(
        "https://c-lims-api.test.dtp-dev.site:6443/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username: username, password: password }),
        }
      );

      const data = await res.json();
      const token = data?.data?.accessToken;

      if (!token) return false;

      // Lưu access-token
      Cookies.set("access-token", token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      // Nếu API trả refresh-token thêm
      const refreshToken = data?.data?.refreshToken;
      if (refreshToken) {
        Cookies.set("lims-refresh-token", refreshToken, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
      }

      setAccessToken(token);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
