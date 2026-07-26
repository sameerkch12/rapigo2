import { api, setApiToken } from '@/lib/api';

export interface UserProfile {
  _id: string;
  fullname: {
    firstname: string;
    lastname?: string;
  };
  email: string;
  phone?: string;
  socketId?: string;
  emailVerified?: boolean;
  rides?: any[];
  name?: string;
  avatar?: string;
  rating?: number;
  totalRides?: number;
  walletBalance?: number;
  memberSince?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserProfile;
}

export const authService = {
  async register(data: {
    fullname: { firstname: string; lastname?: string };
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const res = await api<AuthResponse>('/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setApiToken(res.token);
    }
    return res;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api<AuthResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setApiToken(res.token);
    }
    return res;
  },

  async getProfile(): Promise<{ user: UserProfile }> {
    return await api<{ user: UserProfile }>('/user/profile');
  },

  async updateProfile(data: {
    fullname: { firstname: string; lastname?: string };
    phone?: string;
  }): Promise<{ message: string; user: UserProfile }> {
    return await api<{ message: string; user: UserProfile }>('/user/update', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<{ message: string }> {
    try {
      const res = await api<{ message: string }>('/user/logout');
      setApiToken(null);
      return res;
    } catch (e) {
      setApiToken(null);
      return { message: 'Logged out' };
    }
  },

  async sendPhoneOtp(phone: string): Promise<{ message: string; isDemo?: boolean; otp?: string }> {
    return await api('/user/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  async verifyPhoneOtp(
    phone: string,
    otp: string
  ): Promise<{ message: string; isNewUser: boolean; token?: string; user?: UserProfile }> {
    const res = await api<{ message: string; isNewUser: boolean; token?: string; user?: UserProfile }>(
      '/user/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      }
    );
    if (res.token) {
      setApiToken(res.token);
    }
    return res;
  },

  async registerPhoneUser(data: {
    phone: string;
    fullname: { firstname: string; lastname?: string };
    email: string;
  }): Promise<AuthResponse> {
    const res = await api<AuthResponse>('/user/register-phone', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setApiToken(res.token);
    }
    return res;
  },
};
