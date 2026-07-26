import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker } from '@/components/ui/MapView';
import { useRide } from '@/hooks/useRide';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

export default function LiveTrackingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ride, cancelRide, resetRideState } = useRide();

  const driver = ride.selectedDriver;

  const handleCallDriver = async () => {
    const phone = driver?.phone?.trim();
    if (!phone) {
      Alert.alert('Driver number unavailable', 'Captain phone number is not available yet.');
      return;
    }

    await Linking.openURL(`tel:${phone}`);
  };

  const handleCancel = async () => {
    await cancelRide();
    router.replace('/(tabs)');
  };

  const handleDone = () => {
    resetRideState();
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Map View */}
      <View style={styles.mapArea}>
        <MapView
          style={StyleSheet.absoluteFill}
          region={{
            latitude: ride.pickup?.latitude || 21.2514,
            longitude: ride.pickup?.longitude || 81.6296,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          {ride.pickup && (
            <Marker
              coordinate={{ latitude: ride.pickup.latitude, longitude: ride.pickup.longitude }}
              title="Pickup Location"
              pinColor={Colors.primary}
            />
          )}
          {ride.destination && (
            <Marker
              coordinate={{ latitude: ride.destination.latitude, longitude: ride.destination.longitude }}
              title="Destination"
              pinColor={Colors.error}
            />
          )}
          {driver?.location && (
            <Marker
              coordinate={{ latitude: driver.location.latitude, longitude: driver.location.longitude }}
              title={driver.name || 'Captain'}
            />
          )}
        </MapView>

        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 10 }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Card */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        {/* Status: SEARCHING */}
        {ride.status === 'searching' && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.statusTitle}>Looking for nearby Captains...</Text>
            <Text style={styles.statusSub}>Notifying active captains in your area</Text>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status: DRIVER FOUND / ACCEPTED */}
        {(ride.status === 'driver_found' || ride.status === 'idle') && (
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.statusTitle}>Captain Confirmed</Text>

              {/* Shareable OTP Badge */}
              {ride.otp ? (
                <View style={styles.otpBadge}>
                  <Text style={styles.otpLabel}>OTP</Text>
                  <Text style={styles.otpValue}>{ride.otp}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Text style={{ fontSize: 24 }}>👨‍✈️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{driver?.name || 'Captain Assigned'}</Text>
                <Text style={styles.vehicleDetails}>
                  {driver?.color || ''} {driver?.vehicleType || ride.selectedVehicle} • {driver?.vehicleNumber || 'Plate Pending'}
                </Text>
                <Text style={styles.driverPhone}>{driver?.phone ? `+91 ${driver.phone}` : 'Number Pending'}</Text>
              </View>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={handleCallDriver}
              >
                <MaterialIcons name="call" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.tripInfo}>
              <View style={styles.infoRow}>
                <MaterialIcons name="my-location" size={18} color={Colors.primary} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {ride.pickup?.address || 'Pickup'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={18} color={Colors.error} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {ride.destination?.address || 'Destination'}
                </Text>
              </View>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Total Fare:</Text>
              <Text style={styles.fareValue}>₹{ride.fare}</Text>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status: ONGOING */}
        {ride.status === 'ongoing' && (
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.statusTitle}>Ride in Progress 🚕</Text>
            </View>

            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Text style={{ fontSize: 24 }}>👨‍✈️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{driver?.name || 'Captain'}</Text>
                <Text style={styles.vehicleDetails}>Heading to Destination</Text>
                <Text style={styles.driverPhone}>{driver?.phone ? `+91 ${driver.phone}` : 'Number Pending'}</Text>
              </View>

              <TouchableOpacity style={styles.iconBtn} onPress={handleCallDriver}>
                <MaterialIcons name="call" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Fare to Pay:</Text>
              <Text style={styles.fareValue}>₹{ride.fare}</Text>
            </View>
          </View>
        )}

        {/* Status: COMPLETED */}
        {ride.status === 'completed' && (
          <View style={styles.centerBox}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🎉</Text>
            <Text style={styles.statusTitle}>Ride Completed!</Text>
            <Text style={styles.statusSub}>Amount Paid: ₹{ride.fare}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleDone}>
              <Text style={styles.primaryBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status: CANCELLED */}
        {ride.status === 'cancelled' && (
          <View style={styles.centerBox}>
            <MaterialIcons name="cancel" size={48} color={Colors.error} />
            <Text style={styles.statusTitle}>Ride Cancelled</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleDone}>
              <Text style={styles.primaryBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: { flex: 1 },
  backBtn: {
    position: 'absolute',
    left: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    ...Shadow.md,
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 20,
    ...Shadow.lg,
  },
  centerBox: { alignItems: 'center', paddingVertical: 20 },
  statusTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text.primary },
  statusSub: { fontSize: FontSize.sm, color: Colors.text.secondary, marginTop: 4, marginBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  otpBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
  },
  otpLabel: { fontSize: 10, color: '#1D4ED8', fontWeight: FontWeight.bold },
  otpValue: { fontSize: 18, color: '#1E40AF', fontWeight: FontWeight.extrabold, letterSpacing: 2 },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: Radius.md,
    gap: 12,
    marginBottom: 14,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.text.primary },
  vehicleDetails: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },
  driverPhone: { fontSize: FontSize.xs, color: Colors.text.primary, marginTop: 2, fontWeight: FontWeight.semibold },
  iconBtn: { padding: 8, backgroundColor: '#EFF6FF', borderRadius: 20 },
  tripInfo: { gap: 8, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: FontSize.xs, color: Colors.text.primary, flex: 1 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  fareLabel: { fontSize: FontSize.base, color: Colors.text.secondary },
  fareValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  cancelBtn: { backgroundColor: '#FEE2E2', paddingVertical: 12, borderRadius: Radius.md, alignItems: 'center', marginTop: 10 },
  cancelBtnText: { color: '#DC2626', fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: Radius.md, marginTop: 14 },
  primaryBtnText: { color: '#FFF', fontWeight: FontWeight.bold, fontSize: FontSize.base },
});
