import { io, Socket } from 'socket.io-client';
import { getBaseUrl, getStoredToken } from './api';

let socket: Socket | null = null;
let joinedCaptainId: string | null = null;
const joinedRideRooms = new Set<string>();

/**
 * Socket sirf tab connect hoga jab token available ho (captain logged in ho).
 * Bina token ke connect karne ki koshish nahi karega — backend reject kar deta hai.
 */
export const getDriverSocket = async (): Promise<Socket | null> => {
  const token = await getStoredToken();

  // ✅ Token nahi hai → captain logged in nahi → socket connect mat karo
  if (!token) {
    console.log('[Socket Driver] No token — skipping connection (captain not logged in)');
    return null;
  }

  // Socket already connected hai → wahi return karo
  if (socket?.connected) {
    return socket;
  }

  // Naya socket banana hai ya reconnect karna hai
  if (!socket) {
    const url = getBaseUrl();
    console.log(`[Socket Driver] Connecting to ${url}...`);
    socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: false, // ✅ Manually connect karo — token ready hone ke baad
      auth: { token },
    });

    socket.on('connect', () => {
      console.log(`[Socket Driver] Connected: ${socket?.id}`);
      if (joinedCaptainId) {
        socket?.emit('join', { userId: joinedCaptainId, userType: 'captain' });
      }
      joinedRideRooms.forEach((roomId) => {
        socket?.emit('join-room', { roomId });
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`[Socket Driver] Disconnected: ${reason}`);
    });

    socket.on('connect_error', (err) => {
      // Sirf warn karo — crash mat karo
      console.warn(`[Socket Driver] Connection error: ${err.message}`);
    });
  } else {
    // Socket exist karta hai but connected nahi — token update karo phir reconnect
    (socket as any).auth = { token };
  }

  socket.connect();
  return socket;
};

/** Login ke baad call karo — socket connect + join room */
export const joinCaptainSocket = async (captainId: string) => {
  joinedCaptainId = captainId;
  const s = await getDriverSocket();
  if (!s) return;
  s.emit('join', { userId: captainId, userType: 'captain' });
};

export const joinRideRoom = async (rideId: string) => {
  joinedRideRooms.add(rideId);
  const s = await getDriverSocket();
  if (!s) return;
  s.emit('join-room', { roomId: rideId });
};

export const updateCaptainLocation = async (captainId: string, ltd: number, lng: number, rideId?: string) => {
  const s = await getDriverSocket();
  if (!s) return;
  s.emit('update-location-captain', {
    userId: captainId,
    location: { ltd, lng },
    rideId,
  });
};

export const subscribeToNewRide = async (callback: (ride: any) => void) => {
  const s = await getDriverSocket();
  if (!s) return;
  s.off('new-ride');
  s.on('new-ride', callback);
};

export const subscribeToRideCancelled = async (callback: (ride: any) => void) => {
  const s = await getDriverSocket();
  if (!s) return;
  s.off('ride-cancelled');
  s.on('ride-cancelled', callback);
};

export const subscribeToRideUnavailable = async (callback: (data: { rideId: string; acceptedBy?: string }) => void) => {
  const s = await getDriverSocket();
  if (!s) return;
  s.off('ride-unavailable');
  s.on('ride-unavailable', callback);
};

export const sendChatMessage = async (rideId: string, msg: string, time: string) => {
  const s = await getDriverSocket();
  if (!s) return;
  s.emit('message', { rideId, msg, userType: 'captain', time });
};

export const subscribeToReceiveMessage = async (callback: (msgObj: { msg: string; by: string; time: string }) => void) => {
  const s = await getDriverSocket();
  if (!s) return;
  s.off('receiveMessage');
  s.on('receiveMessage', callback);
};

export const disconnectDriverSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    joinedCaptainId = null;
    joinedRideRooms.clear();
  }
};

export const socketService = {
  updateLocation: async (captainId: string, rideId: string, ltd: number, lng: number, heading = 0) => {
    const s = await getDriverSocket();
    if (!s) return;
    s.emit('update-location-captain', {
      userId: captainId,
      location: { ltd, lng, heading },
      rideId,
    });
  },
};
