import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';

export interface MapViewProps {
  style?: any;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  /** @deprecated use region instead */
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  children?: React.ReactNode;
  onMapReady?: () => void;
}

export interface MarkerProps {
  coordinate: { latitude: number; longitude: number };
  title?: string;
  pinColor?: string;
  children?: React.ReactNode;
}

export interface PolylineProps {
  coordinates: Array<{ latitude: number; longitude: number }>;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface CalloutProps {
  tooltip?: boolean;
  children?: React.ReactNode;
}

export const Callout = ({ children }: CalloutProps) => <>{children}</>;

// Markers collected by context to pass to iframe URL
const markerRegistry: { coordinate: { latitude: number; longitude: number }; pinColor?: string; title?: string }[] = [];

export const Marker = ({ coordinate, title, pinColor = '#3B82F6' }: MarkerProps) => {
  // Register marker on mount — parent MapView picks them up via children scan
  return null; // Rendered via iframe URL params
};

export const Polyline = ({ }: PolylineProps) => null;

// ─────────────────────────────────────────────
// Web Google Maps Embed via iframe
// ─────────────────────────────────────────────
function WebMapView({ region, initialRegion, children, onMapReady }: MapViewProps) {
  const activeRegion = region || initialRegion;
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extract marker coordinates from children props
  const markers: { lat: number; lng: number; color?: string; title?: string }[] = [];
  React.Children.forEach(children, (child: any) => {
    if (child?.props?.coordinate) {
      markers.push({
        lat: child.props.coordinate.latitude,
        lng: child.props.coordinate.longitude,
        color: child.props.pinColor,
        title: child.props.title,
      });
    }
  });

  const lat = activeRegion?.latitude ?? 21.2514;
  const lng = activeRegion?.longitude ?? 81.6296;
  const zoom = activeRegion
    ? Math.round(14 - Math.log2(activeRegion.latitudeDelta * 100))
    : 13;

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '';

  // Build embed URL — if 2 markers, use directions mode
  let embedUrl = '';
  if (apiKey) {
    if (markers.length >= 2) {
      embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${markers[0].lat},${markers[0].lng}&destination=${markers[markers.length - 1].lat},${markers[markers.length - 1].lng}&mode=driving`;
    } else if (markers.length === 1) {
      embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${markers[0].lat},${markers[0].lng}&zoom=${zoom}`;
    } else {
      embedUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap`;
    }
  }

  useEffect(() => {
    if (loaded && onMapReady) onMapReady();
  }, [loaded]);

  if (!apiKey) {
    // No API key — show OpenStreetMap fallback via iframe (no key needed)
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik${markers.map(m => `&marker=${m.lat},${m.lng}`).join('')}`;
    return (
      <View style={[styles.container]}>
        {!loaded && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loaderText}>Loading map...</Text>
          </View>
        )}
        {/* @ts-ignore */}
        <iframe
          ref={iframeRef}
          src={osmUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          onLoad={() => setLoaded(true)}
          title="Map"
          loading="lazy"
        />
        {/* Overlay markers as HTML pins */}
        {loaded && markers.map((m, i) => (
          <View key={i} style={[styles.markerOverlay, { backgroundColor: m.color || '#3B82F6' }]}>
            <Text style={styles.markerPin}>📍</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!loaded && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loaderText}>Loading map...</Text>
        </View>
      )}
      {/* @ts-ignore */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{ width: '100%', height: '100%', border: 'none', display: loaded ? 'block' : 'none' }}
        onLoad={() => setLoaded(true)}
        allowFullScreen
        title="Google Maps"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </View>
  );
}

// ─────────────────────────────────────────────
// Native fallback (non-web without react-native-maps)
// ─────────────────────────────────────────────
function NativeMapPlaceholder({ region, initialRegion, children, onMapReady }: MapViewProps) {
  const activeRegion = region || initialRegion;

  useEffect(() => {
    if (onMapReady) onMapReady();
  }, []);

  return (
    <View style={styles.nativePlaceholder}>
      <View style={styles.gridOverlay}>
        <Text style={styles.mapText}>🗺️ Map</Text>
        {activeRegion && (
          <Text style={styles.regionText}>
            {activeRegion.latitude.toFixed(4)}, {activeRegion.longitude.toFixed(4)}
          </Text>
        )}
      </View>
      <View style={styles.markersContainer}>{children}</View>
    </View>
  );
}

export default function MapView(props: MapViewProps) {
  if (Platform.OS === 'web') {
    return <WebMapView {...props} />;
  }
  return <NativeMapPlaceholder {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative' as any,
    backgroundColor: '#E8F0FE',
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
    fontWeight: '600',
  },
  markerOverlay: {
    position: 'absolute' as any,
    top: '50%' as any,
    left: '50%' as any,
    zIndex: 20,
  },
  markerPin: { fontSize: 24 },
  nativePlaceholder: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as any,
    overflow: 'hidden' as any,
  },
  gridOverlay: {
    position: 'absolute' as any,
    top: 20,
    zIndex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  regionText: { fontSize: 10, color: '#64748B', marginTop: 2 },
  markersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
});
