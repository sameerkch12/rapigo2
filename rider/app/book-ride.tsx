import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRide } from '@/hooks/useRide';
import VehicleCard from '@/components/ride/VehicleCard';
import MapView, { Marker, Polyline } from '@/components/ui/MapView';
import { rideService } from '@/services/ride.service';
import { FontWeight, Shadow } from '@/constants/theme';

const VEHICLE_TYPES = [
  { id: 'bike', name: 'Bike', emoji: '🏍️', description: '1 seat • 3 min', eta: 3, seats: 1, rating: 4.7, tag: 'Fastest', tagColor: '#2563EB' },
  { id: 'auto', name: 'Auto', emoji: '🛺', description: '3 seats • 6 min', eta: 6, seats: 3, rating: 4.5, tag: 'Affordable', tagColor: '#16A34A' },
  { id: 'car', name: 'Car', emoji: '🚗', description: '4 seats • 8 min', eta: 8, seats: 4, rating: 4.8, tag: 'Premium', tagColor: '#9333EA' },
  { id: 'xl', name: 'Car XL', emoji: '🚙', description: '6 seats • 10 min', eta: 10, seats: 6, rating: 4.9, tag: 'Spacious', tagColor: '#2563EB' },
];

const { height } = Dimensions.get('window');

export default function BookRideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ride, selectVehicle, startSearch, applyCoupon, setPaymentMethod, setPickup, setDestination } = useRide();



  const MAP_HEIGHT = height * 0.38;

  // Calculate region that fits both pickup and drop zoomed in closely
  const mapRegion = useMemo(() => {
    if (ride.pickup && ride.destination) {
      const minLat = Math.min(ride.pickup.latitude, ride.destination.latitude);
      const maxLat = Math.max(ride.pickup.latitude, ride.destination.latitude);
      const minLng = Math.min(ride.pickup.longitude, ride.destination.longitude);
      const maxLng = Math.max(ride.pickup.longitude, ride.destination.longitude);
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      
      const latPad = Math.max(latDiff * 0.15, 0.008);
      const lngPad = Math.max(lngDiff * 0.15, 0.008);
      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(latDiff + latPad * 2, 0.02),
        longitudeDelta: Math.max(lngDiff + lngPad * 2, 0.02),
      };
    }
    return {
      latitude: ride.pickup?.latitude || 21.2514,
      longitude: ride.pickup?.longitude || 81.6296,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    };
  }, [ride.pickup, ride.destination]);

  const [selectedId, setSelectedId] = useState<string>('bike');
  const [couponText, setCouponText] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [searching, setSearching] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  // Real data from /places/route API — replaces hardcoded Haversine + priceTable
  const [apiFares, setApiFares] = useState<Record<string, number>>({});
  const [apiDistanceKm, setApiDistanceKm] = useState<number>(0);

  // Fetch actual turn-by-turn road route coordinates between pickup and destination
  useEffect(() => {
    if (!ride.pickup || !ride.destination) {
      setRouteCoordinates([]);
      return;
    }

    const fetchRoadRoute = async () => {
      try {
        const pickupAddr = ride.pickup?.address || `${ride.pickup!.latitude},${ride.pickup!.longitude}`;
        const destAddr = ride.destination?.address || `${ride.destination!.latitude},${ride.destination!.longitude}`;

        const response = await rideService.getFare(pickupAddr, destAddr);
        
        setRouteCoordinates([
          { latitude: ride.pickup!.latitude, longitude: ride.pickup!.longitude },
          { latitude: ride.destination!.latitude, longitude: ride.destination!.longitude },
        ]);

        if (response.distanceTime?.distance?.value) {
          setApiDistanceKm(Math.round((response.distanceTime.distance.value / 1000) * 10) / 10);
        }
        if (response.fare) {
          const fares: Record<string, number> = {
            bike: response.fare.bike || 0,
            auto: response.fare.auto || 0,
            car: response.fare.car || 0,
            xl: Math.round((response.fare.car || 0) * 1.4),
          };
          setApiFares(fares);
          selectVehicle(selectedId, fares[selectedId] || 0);
        }
      } catch (err) {
        console.warn('Fetching fare from backend failed:', err);
        setRouteCoordinates([
          { latitude: ride.pickup!.latitude, longitude: ride.pickup!.longitude },
          { latitude: ride.destination!.latitude, longitude: ride.destination!.longitude },
        ]);
      }
    };

    fetchRoadRoute();
  }, [ride.pickup, ride.destination, selectVehicle, selectedId]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const slideAnim = useRef(new Animated.Value(height * 0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 4 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    selectVehicle(id, apiFares[id] || 0);
  };

  const handleSwapRoute = () => {
    if (ride.pickup && ride.destination) {
      const temp = ride.pickup;
      setPickup(ride.destination);
      setDestination(temp);
    }
  };

  const handleCoupon = () => {
    const result = applyCoupon(couponText);
    if (result) {
      setCouponApplied(true);
      setCouponError('');
      setShowCouponModal(false);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleBook = async () => {
    setSearching(true);
    try {
      await startSearch(apiDistanceKm, currentFare); // fare bhi bhejo — backend dobara calculate nahi karega
      router.push('/live-tracking');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const getFare = (id: string) => apiFares[id] || 0;
  const currentFare = getFare(selectedId);
  const discountedFare = couponApplied ? Math.round(currentFare * 0.7) : currentFare;
  const selectedVehicleObj = VEHICLE_TYPES.find((v) => v.id === selectedId) || VEHICLE_TYPES[0];

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: 'payments' },
    { id: 'wallet', label: 'Wallet', icon: 'account-balance-wallet' },
    { id: 'card', label: 'Card', icon: 'credit-card' },
  ] as const;

  const currentPaymentLabel = paymentMethods.find((p) => p.id === ride.paymentMethod)?.label || 'Cash';

  const [mapReady, setMapReady] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Clean Interactive Map View */}
      <View style={[styles.mapArea, { height: MAP_HEIGHT }]}>
        <MapView
          style={StyleSheet.absoluteFill}
          region={mapRegion}
          onMapReady={() => setMapReady(true)}
        >
          {ride.pickup && (
            <Marker
              coordinate={{ latitude: ride.pickup.latitude, longitude: ride.pickup.longitude }}
              pinColor="#16A34A"
            />
          )}
          {ride.destination && (
            <Marker
              coordinate={{ latitude: ride.destination.latitude, longitude: ride.destination.longitude }}
              pinColor="#DC2626"
            />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#2563EB"
              strokeWidth={5}
            />
          )}
        </MapView>

        {/* Back Button (Top Left) */}
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 12 }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>

        {/* Distance Badge (Top Right) */}
        <View style={[styles.distanceBadge, { top: insets.top + 12 }]}>
          <MaterialIcons name="map" size={16} color="#2563EB" />
          <Text style={styles.distanceText}>{apiDistanceKm > 0 ? `${apiDistanceKm} km` : '...'}</Text>
        </View>
      </View>

      {/* Bottom Sheet Card */}
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + 12 },
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Location Summary Box with Green/Red Edit Buttons & Swap Arrow */}
        <View style={styles.locationContainerRow}>
          <View style={styles.locationSummaryBox}>
            {/* Pickup Row */}
            <View style={styles.locRow}>
              <View style={[styles.locRing, { borderColor: '#16A34A' }]}>
                <View style={[styles.locDot, { backgroundColor: '#16A34A' }]} />
              </View>
              <Text style={styles.locText} numberOfLines={1}>
                {ride.pickup?.address || 'Pickup location'}
              </Text>
              <TouchableOpacity
                style={[styles.editPillBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
                onPress={() => router.push('/location-search' as any)}
              >
                <MaterialIcons name="edit" size={13} color="#16A34A" />
                <Text style={[styles.editPillText, { color: '#16A34A' }]}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Dotted Line */}
            <View style={styles.locDottedLine} />

            {/* Drop Row */}
            <View style={styles.locRow}>
              <View style={[styles.locRing, { borderColor: '#DC2626' }]}>
                <View style={[styles.locDot, { backgroundColor: '#DC2626' }]} />
              </View>
              <Text style={styles.locText} numberOfLines={1}>
                {ride.destination?.address || 'Drop location'}
              </Text>
              <TouchableOpacity
                style={[styles.editPillBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                onPress={() => router.push('/location-search' as any)}
              >
                <MaterialIcons name="edit" size={13} color="#DC2626" />
                <Text style={[styles.editPillText, { color: '#DC2626' }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Swap Vertical Button */}
          <TouchableOpacity style={styles.swapVerticalBtn} onPress={handleSwapRoute}>
            <MaterialIcons name="swap-vert" size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Section Heading */}
        <Text style={styles.chooseTitle}>Choose a ride</Text>

        {/* Vehicles List */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height * 0.38 }}>
          {VEHICLE_TYPES.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              fare={getFare(v.id)}
              selected={selectedId === v.id}
              onSelect={() => handleSelect(v.id)}
            />
          ))}
        </ScrollView>

        {/* Bottom Payment & Offers Controls Row */}
        <View style={styles.bottomControlsRow}>
          <TouchableOpacity 
            style={styles.controlPill} 
            onPress={() => setShowPaymentModal(true)}
          >
            <MaterialIcons name="payment" size={18} color="#2563EB" />
            <Text style={styles.controlLabel}>{currentPaymentLabel}</Text>
            <MaterialIcons name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlPill} 
            onPress={() => setShowCouponModal(true)}
          >
            <MaterialIcons name="percent" size={18} color="#2563EB" />
            <Text style={styles.controlLabel}>
              {couponApplied ? 'Offers Applied' : 'Offers'}
            </Text>
            <MaterialIcons name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Book Ride Button */}
        <TouchableOpacity
          style={[styles.bookRideButton, searching && styles.bookRideButtonDisabled]}
          onPress={handleBook}
          disabled={searching}
          activeOpacity={0.85}
        >
          <MaterialIcons name="local-taxi" size={20} color="#FFFFFF" />
          <Text style={styles.bookRideButtonText}>
            {searching ? 'Finding Driver...' : `Book ${selectedVehicleObj.name} • ₹${discountedFare}`}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Payment Selection Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            {paymentMethods.map((pm) => (
              <TouchableOpacity
                key={pm.id}
                style={styles.modalRow}
                onPress={() => {
                  setPaymentMethod(pm.id);
                  setShowPaymentModal(false);
                }}
              >
                <MaterialIcons name={pm.icon} size={22} color="#2563EB" />
                <Text style={styles.modalRowText}>{pm.label}</Text>
                {ride.paymentMethod === pm.id && (
                  <MaterialIcons name="check" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Offers / Coupon Modal */}
      <Modal visible={showCouponModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Offer / Coupon</Text>
            <TextInput
              style={styles.couponInputModal}
              placeholder="Enter coupon code (e.g. RAPIGO30)"
              placeholderTextColor="#94A3B8"
              value={couponText}
              onChangeText={(t) => { setCouponText(t); setCouponError(''); }}
              autoCapitalize="characters"
            />
            {couponError ? <Text style={styles.errorTextModal}>{couponError}</Text> : null}
            <TouchableOpacity style={styles.applyBtnModal} onPress={handleCoupon}>
              <Text style={styles.applyBtnTextModal}>Apply Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCouponModal(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  distanceBadge: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: FontWeight.extrabold,
    color: '#0F172A',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
    zIndex: 10,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 16,
    ...Shadow.lg,
  },
  locationContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  locationSummaryBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 12,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  locText: {
    flex: 1,
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  locDottedLine: {
    width: 1,
    height: 14,
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderColor: '#CBD5E1',
    marginLeft: 7,
    marginVertical: 4,
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  editPillText: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
  },
  swapVerticalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseTitle: {
    fontSize: 17,
    fontWeight: FontWeight.extrabold,
    color: '#0F172A',
    marginBottom: 12,
  },
  bottomControlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 14,
  },
  controlPill: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  controlLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  bookRideButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    ...Shadow.md,
  },
  bookRideButtonDisabled: {
    opacity: 0.7,
  },
  bookRideButtonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: FontWeight.extrabold,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: FontWeight.extrabold,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
  },
  couponInputModal: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
  },
  errorTextModal: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 12,
  },
  applyBtnModal: {
    backgroundColor: '#2563EB',
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  applyBtnTextModal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  closeBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  closeBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
});
