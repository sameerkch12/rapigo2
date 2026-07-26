import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserProfile } from '@/services/auth.service';
import { getStoredToken } from '@/lib/api';
import { joinUserSocket } from '@/services/socket';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullname: { firstname: string; lastname?: string };
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<{ message: string; isDemo?: boolean; otp?: string }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<{ isNewUser: boolean; token?: string; user?: UserProfile }>;
  registerPhoneUser: (data: {
    phone: string;
    fullname: { firstname: string; lastname?: string };
    email: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const storedToken = await getStoredToken();
      if (storedToken) {
        setToken(storedToken);
        const { user: userProfile } = await authService.getProfile();
        setUser(userProfile);
        joinUserSocket(userProfile._id);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      joinUserSocket(res.user._id);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullname: { firstname: string; lastname?: string };
    email: string;
    password: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      setToken(res.token);
      joinUserSocket(res.user._id);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async (phone: string) => {
    setIsLoading(true);
    try {
      return await authService.sendPhoneOtp(phone);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyPhoneOtp(phone, otp);
      if (res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        joinUserSocket(res.user._id);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const registerPhoneUser = async (data: {
    phone: string;
    fullname: { firstname: string; lastname?: string };
    email: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.registerPhoneUser(data);
      setUser(res.user);
      setToken(res.token);
      joinUserSocket(res.user._id);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        sendPhoneOtp,
        verifyPhoneOtp,
        registerPhoneUser,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
