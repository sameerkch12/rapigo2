import { api } from '@/lib/api';

export interface LocationCoords {
  ltd: number;
  lng: number;
}

export interface DistanceTimeResponse {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  status: string;
}

export interface FareResponse {
  fare: {
    auto: number;
    car: number;
    bike: number;
  };
  distanceTime: DistanceTimeResponse;
}

export const mapService = {
  async getSuggestions(input: string): Promise<string[]> {
    if (!input || input.length < 3) return [];
    try {
      return await api<string[]>(`/map/get-suggestions?input=${encodeURIComponent(input)}`);
    } catch {
      return [];
    }
  },

  async getCoordinates(address: string): Promise<LocationCoords> {
    return await api<LocationCoords>(`/map/get-coordinates?address=${encodeURIComponent(address)}`);
  },

  async getDistanceTime(origin: string, destination: string): Promise<DistanceTimeResponse> {
    return await api<DistanceTimeResponse>(
      `/map/get-distance-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
    );
  },
};
