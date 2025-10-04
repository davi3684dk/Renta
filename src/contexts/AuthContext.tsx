import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.0.200:3000";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  handleTokenExpiration: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on app start
  useEffect(() => {
    AsyncStorage.getItem("jwt").then((savedToken) => {
      setToken(savedToken);
      setIsLoading(false);
    });
  }, []);

  const register = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, firstName, lastName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      // Don't auto-login, just return success
    } catch (error: any) {
      if (error.message === "Network request failed") {
        throw new Error(
          "Cannot connect to server. Make sure backend is running on port 3000"
        );
      }
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const jwtToken = data.access_token;

      await AsyncStorage.setItem("jwt", jwtToken);
      setToken(jwtToken);
    } catch (error: any) {
      if (error.message === "Network request failed") {
        throw new Error(
          "Cannot connect to server. Make sure backend is running on port 3000"
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("jwt");
    setToken(null);
  };

  const handleTokenExpiration = async () => {
    console.log("Token expired - logging out user");
    await AsyncStorage.removeItem("jwt");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        register,
        logout,
        handleTokenExpiration,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
