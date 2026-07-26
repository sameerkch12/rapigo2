/**
 * DriverMapView — Real Google Maps embed for web, fallback for native.
 * Accepts either address strings OR lat/lng coordinates.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';

export interface DriverMapViewProps {
  /** Pickup — address string OR coordinates */
  pickup?: { latitude: number; longitude: number } | string;
  /** Destination/Drop — address string OR coordinates */
  destination?: { latitude: number; longitude: number } | string;
  /** Driver's current coordinates */
  driverLocation?: { latitude: number; longitude: number };
  /** Map display mode */
  mode?: 'to-pickup' | 'in-ride' | 'overview';
  style?: any;
}

// Helper: convert pickup/destination to a string usable in Google Maps URL
const toLocationParam = (loc?: { latitude: number; longitude: number } | string): string => {
  if (!loc) return '';
  if (typeof loc === 'string') return encodeURIComponent(loc);
  return `${loc.latitude},${loc.longitude}`;
};

// ─────────────────────────────────────────────
// Web & Default Map (Google Maps Embed / OpenStreetMap)
// ─────────────────────────────────────────────
function DriverMapCanvas({ pickup, destination, driverLocation, mode }: DriverMapViewProps) {
  const [loaded, setLoaded] = useState(false);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '';

  const buildUrl = (): string => {
    const pickupParam = toLocationParam(pickup);
    const destParam = toLocationParam(destination);
    const driverParam = driverLocation
      ? `${driverLocation.latitude},${driverLocation.longitude}`
      : '';

    if (!apiKey) {
      // ── OpenStreetMap fallback (no key needed) ──
      let lat = 21.2514, lng = 81.6296;
      if (pickup && typeof pickup !== 'string') { lat = pickup.latitude; lng = pickup.longitude; }
      else if (driverLocation) { lat = driverLocation.latitude; lng = driverLocation.longitude; }

      let osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.025},${lat - 0.025},${lng + 0.025},${lat + 0.025}&layer=mapnik`;
      if (pickup && typeof pickup !== 'string') osmUrl += `&marker=${pickup.latitude},${pickup.longitude}`;
      if (destination && typeof destination !== 'string') osmUrl += `&marker=${destination.latitude},${destination.longitude}`;
      return osmUrl;
    }

    // ── Google Maps Embed ──
    if (mode === 'to-pickup' && driverParam && pickupParam) {
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${driverParam}&destination=${pickupParam}&mode=driving`;
    }
    if (mode === 'to-pickup' && pickupParam) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${pickupParam}&zoom=15`;
    }
    if (mode === 'in-ride' && pickupParam && destParam) {
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${pickupParam}&destination=${destParam}&mode=driving`;
    }
    if (pickupParam && destParam) {
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${pickupParam}&destination=${destParam}&mode=driving`;
    }
    if (pickupParam) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${pickupParam}&zoom=14`;
    }
    return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=21.2514,81.6296&zoom=13`;
  };

  if (Platform.OS !== 'web') {
    const pickupLabel = typeof pickup === 'string' ? pickup : pickup ? `${pickup.latitude.toFixed(4)}, ${pickup.longitude.toFixed(4)}` : '';
    return (
      <View style={[styles.container, styles.fallbackCanvas]}>
        <Text style={styles.fallbackIcon}>🗺️</Text>
        <Text style={styles.fallbackText}>
          {mode === 'to-pickup' ? 'Pickup tak navigate kar rahe hain' : 'Drop tak jaa rahe hain'}
        </Text>
        {pickupLabel ? <Text style={styles.coordText}>📍 {pickupLabel}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!loaded && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loaderText}>Map load ho raha hai...</Text>
        </View>
      )}
      {/* @ts-ignore — iframe is valid in React Native Web */}
      <iframe
        src={buildUrl()}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: loaded ? 'block' : 'none',
        }}
        onLoad={() => setLoaded(true)}
        allowFullScreen
        title="Driver Map"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
}

export default function DriverMapView(props: DriverMapViewProps) {
  return <DriverMapCanvas {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#EBF3FB',
    overflow: 'hidden' as any,
  },
  loader: {
    position: 'absolute' as any,
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    zIndex: 10,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600' as const,
  },
  fallbackCanvas: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  fallbackIcon: { fontSize: 48 },
  fallbackText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#2563EB',
  },
  coordText: { fontSize: 11, color: '#64748B', marginTop: 4 },
});
