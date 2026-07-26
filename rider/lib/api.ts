import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL || Constants.expoConfig?.extra?.apiBaseUrl;

export const getBaseUrl = () => {
  // 1. Check configured EXPO_PUBLIC_API_BASE_URL from .env first
  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl);
      const port = url.port || '4000';
      return `${url.protocol}//${url.hostname}:${port}`;
    } catch {
      // fallback
    }
  }

  // 2. Web browser fallback
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:4000`;
  }

  // 3. Host URI from Expo Go (only if it is a valid IPv4 address, not a tunnel domain)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      return `http://${ip}:4000`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:4000';
  }

  return 'http://localhost:4000';
};

let authToken: string | null = null;

export function setApiToken(value: string | null) {
  authToken = value;
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try {
      if (value) localStorage.setItem('user_token', value);
      else localStorage.removeItem('user_token');
    } catch {}
  }
  try {
    if (value) {
      AsyncStorage.setItem('user_token', value).catch(() => {});
    } else {
      AsyncStorage.removeItem('user_token').catch(() => {});
    }
  } catch {}
}

export async function getStoredToken(): Promise<string | null> {
  if (authToken) return authToken;
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try {
      const token = localStorage.getItem('user_token');
      if (token) {
        authToken = token;
        return token;
      }
    } catch {}
  }
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (token) authToken = token;
    return token;
  } catch {
    return null;
  }
}


export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = await getStoredToken();
  const fullUrl = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;

  console.log(`[API Request] ${options.method || 'GET'} ${fullUrl}`);

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { token } : {}),
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = Array.isArray(body)
      ? body.map((e: any) => e.msg || e.message).join(', ')
      : body.message || body.error || 'Request failed';
    throw new Error(errorMsg);
  }
  return body as T;
}
