import { Platform } from 'react-native';
import Constants from 'expo-constants';

const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL || Constants.expoConfig?.extra?.apiBaseUrl || Constants.manifest?.extra?.apiBaseUrl;

const getBaseHost = () => {
  // 1. Check configured EXPO_PUBLIC_API_BASE_URL from app.json extra first, then .env
  if (configuredUrl) {
    try {
      const url = new URL(configuredUrl);
      const port = url.port || '4000';
      return `${url.protocol}//${url.hostname}:${port}`;
    } catch {
      // Fall through
    }
  }

  // 2. Web browser fallback
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:4000`;
  }

  // 3. Host URI from Expo Go (only if IPv4 address, not a tunnel domain)
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

export const API_BASE_URL = getBaseHost();
export const SOCKET_URL = getBaseHost();

