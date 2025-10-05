import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/Consts";

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

const getTokenExpiration = (token: string): number | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.exp ? payload.exp * 1000 : null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const expirationTime = getTokenExpiration(token);
  if (!expirationTime) return true;

  const currentTime = Date.now();
  const isExpired = currentTime >= expirationTime;

  if (isExpired) {
    console.log("Token is expired");
  } else {
    const timeUntilExpiry = Math.floor((expirationTime - currentTime) / 1000);
    console.log(`Token expires in ${timeUntilExpiry} seconds`);
  }

  return isExpired;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearExpirationTimer = () => {
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }
  };

  const setupExpirationTimer = (jwtToken: string) => {
    clearExpirationTimer();

    const expirationTime = getTokenExpiration(jwtToken);
    if (!expirationTime) {
      console.error("Could not get token expiration time");
      return;
    }

    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    if (timeUntilExpiry > 0) {
      console.log(
        `Setting up auto-logout in ${Math.floor(
          timeUntilExpiry / 1000
        )} seconds`
      );

      expirationTimerRef.current = setTimeout(() => {
        console.log("Token expired - auto logout triggered");
        handleTokenExpiration();
      }, timeUntilExpiry);
    } else {
      console.log("Token already expired");
      handleTokenExpiration();
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("jwt").then((savedToken) => {
      if (savedToken) {
        if (isTokenExpired(savedToken)) {
          console.log("Saved token is expired, clearing it");
          AsyncStorage.removeItem("jwt");
          setToken(null);
        } else {
          console.log("Saved token is still valid");
          setToken(savedToken);
          setupExpirationTimer(savedToken);
        }
      }
      setIsLoading(false);
    });

    return () => {
      clearExpirationTimer();
    };
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

      // Set up automatic logout when token expires
      setupExpirationTimer(jwtToken);
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
    clearExpirationTimer();
    await AsyncStorage.removeItem("jwt");
    setToken(null);
  };

  const handleTokenExpiration = async () => {
    console.log("Token expired - logging out user");
    clearExpirationTimer();
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
