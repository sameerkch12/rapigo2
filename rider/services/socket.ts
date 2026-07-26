import { io, Socket } from 'socket.io-client';
import { getBaseUrl, getStoredToken } from '@/lib/api';

let socket: Socket | null = null;
let joinedUserId: string | null = null;
const joinedRideRooms = new Set<string>();
const eventHandlers = new Map<string, (...args: any[]) => void>();

const bindStoredHandlers = (s: Socket) => {
  eventHandlers.forEach((handler, event) => {
    s.off(event);
    s.on(event, handler);
  });
};

const setSocketHandler = async (event: string, callback: (...args: any[]) => void) => {
  eventHandlers.set(event, callback);
  const s = await getSocket();
  if (!s) return;
  s.off(event);
  s.on(event, callback);
};

/**
 * Socket sirf tab connect hoga jab token available ho (user logged in ho).
 * Bina token ke connect karne ki koshish nahi karega — backend reject kar deta hai.
 */
export const getSocket = async (): Promise<Socket | null> => {
  const token = await getStoredToken();

  // ✅ Token nahi hai → user logged in nahi → socket connect mat karo
  if (!token) {
    console.log('[Socket Rider] No token — skipping connection (user not logged in)');
    return null;
  }

  // Socket already connected hai → wahi return karo
  if (socket?.connected) {
    return socket;
  }

  // Naya socket banana ya reconnect karna hai token ke saath
  if (!socket) {
    const url = getBaseUrl();
    // ---- Backend health check ----
    try {
      const healthRes = await fetch(`${url.replace(/\/*$/, '')}/health`);
      if (!healthRes.ok) {
        console.warn('[Socket Rider] Backend health check failed – skipping socket connection');
        return null;
      }
    } catch (e) {
      console.warn('[Socket Rider] Backend not reachable – skipping socket connection');
      return null;
    }
    console.log(`[Socket Rider] Connecting to ${url}...`);

    socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: false, // ✅ Manually connect karo — token ready hone ke baad
      auth: { token },
    });

    socket.on('connect', () => {
      console.log(`[Socket Rider] Connected: ${socket?.id}`);
      if (socket) {
        bindStoredHandlers(socket);
      }
      if (joinedUserId) {
        socket?.emit('join', { userId: joinedUserId, userType: 'user' });
      }
      joinedRideRooms.forEach((roomId) => {
        socket?.emit('join-room', { roomId });
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket Rider] Disconnected: ${reason}`);
    });

    socket.on('connect_error', (err) => {
      // Sirf log karo — crash mat karo
      console.warn(`[Socket Rider] Connection error: ${err.message}`);
    });
  } else {
    // Socket exist karta hai but connected nahi — auth token update karo phir reconnect
    (socket as any).auth = { token };
  }

  socket.connect();
  return socket;
};

/** Login ke baad call karo — socket connect + join room */
export const joinUserSocket = async (userId: string) => {
  joinedUserId = userId;
  const s = await getSocket();
  if (!s) return;
  s.emit('join', { userId, userType: 'user' });
};

export const joinRideRoom = async (rideId: string) => {
  joinedRideRooms.add(rideId);
  const s = await getSocket();
  if (!s) return;
  s.emit('join-room', { roomId: rideId });
};

export const subscribeToRideConfirmed = async (callback: (ride: any) => void) => {
  await setSocketHandler('ride-confirmed', callback);
};

export const subscribeToRideStarted = async (callback: (ride: any) => void) => {
  await setSocketHandler('ride-started', callback);
};

export const subscribeToDriverLocation = async (
  callback: (data: { rideId: string; latitude: number; longitude: number; heading?: number }) => void
) => {
  await setSocketHandler('driver-location-updated', callback);
};

export const subscribeToRideCompleted = async (callback: (ride: any) => void) => {
  await setSocketHandler('ride-ended', callback);
};

export const subscribeToRideCancelled = async (callback: (ride: any) => void) => {
  await setSocketHandler('ride-cancelled', callback);
};

export const sendChatMessage = async (rideId: string, msg: string, userType: 'user' | 'captain', time: string) => {
  const s = await getSocket();
  if (!s) return;
  s.emit('message', { rideId, msg, userType, time });
};

export const subscribeToReceiveMessage = async (callback: (msgObj: { msg: string; by: string; time: string }) => void) => {
  await setSocketHandler('receiveMessage', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    joinedUserId = null;
    joinedRideRooms.clear();
    eventHandlers.clear();
  }
};
