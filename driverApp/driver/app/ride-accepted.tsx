import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDriverRide } from '../contexts/DriverRideContext';
import { useDriverAuth } from '../contexts/DriverAuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getRideAddress, getRideDistanceKm } from '../utils/ride';
import DriverMapView from '../components/DriverMapView';

export default function RideAcceptedScreen() {
  const router = useRouter();
  const { activeRide, reachedPickup } = useDriverRide();
  const { driver } = useDriverAuth();

  const pickupAddress = getRideAddress(activeRide?.pickup, 'Pickup location');
  const dropAddress = getRideAddress(activeRide?.destination, 'Drop location');
  const distanceToPickup = activeRide?.pickupDistanceKm || 1.2;
  const totalDistance = activeRide?.distanceKm || getRideDistanceKm(activeRide?.distance);

  const handleReachedPickup = async () => {
    await reachedPickup();
    router.replace('/at-pickup');
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="Ride Accepted" showSupport showOptions />

      <Text style={styles.subHeaderBanner}>Head to Pickup</Text>

      {/* Top Address Summary Card */}
      <View style={[styles.addressCard, Shadows.card]}>
        <View style={styles.addressRow}>
          <Ionicons name="location" size={18} color={Colors.accentGreen} />
          <View style={styles.addressTextWrapper}>
            <Text style={styles.labelGreen}>Pickup</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {pickupAddress}
            </Text>
          </View>
          <View style={styles.distBadge}>
            <Text style={styles.distText}>{distanceToPickup} km</Text>
            <TouchableOpacity style={styles.compassBtn}>
              <Ionicons name="navigate-circle" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lineDivider} />

        <View style={styles.addressRow}>
          <Ionicons name="location" size={18} color={Colors.danger} />
          <View style={styles.addressTextWrapper}>
            <Text style={styles.labelRed}>Drop</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {dropAddress}
            </Text>
          </View>
          <Text style={styles.totalDistText}>{totalDistance || '--'} km</Text>
        </View>
      </View>

      {/* ✅ Real Map — Driver to Pickup route */}
      <View style={styles.mapCanvas}>
        <DriverMapView
          mode="to-pickup"
          pickup={activeRide?.pickup}
          driverLocation={
            driver?.location?.coordinates?.length === 2
              ? { latitude: driver.location.coordinates[1], longitude: driver.location.coordinates[0] }
              : undefined
          }
        />
      </View>

      {/* Bottom Action Floating Card */}
      <View style={[styles.bottomCard, Shadows.card]}>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Time to reach</Text>
            <Text style={styles.statValue}>4 min</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{distanceToPickup} km</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.reachedBtn} onPress={handleReachedPickup}>
          <Text style={styles.btnText}>Reached Pickup</Text>
          <Ionicons name="chevron-forward-circle" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  subHeaderBanner: {
    backgroundColor: Colors.primary,
    color: '#FFF',
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.9,
  },
  addressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: -4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    zIndex: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTextWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  labelGreen: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentGreen,
    textTransform: 'uppercase',
  },
  labelRed: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.danger,
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
  },
  distBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  compassBtn: {
    padding: 2,
  },
  totalDistText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  lineDivider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: 8,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#EBF3FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinGreen: {
    marginBottom: 30,
  },
  driverNodePin: {
    marginTop: 10,
  },
  routePathHint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bottomCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textDark,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.surfaceBorder,
  },
  reachedBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
