"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAPi } from "../api-endpoints/authendication";

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["getUserData", userId],
    queryFn: () => getUserAPi(`${userId}`),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const login = (userData: any) => {
    const userId = userData?.user_id || userData?.id || userData?.user?.id;
    if (userId) {
      localStorage.setItem('userId', userId);
      setUserId(userId);
      setUser(userData.user || userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUserId(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
