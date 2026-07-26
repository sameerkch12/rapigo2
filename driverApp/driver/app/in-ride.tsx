import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDriverRide } from '../contexts/DriverRideContext';
import { HeaderBar } from '../components/HeaderBar';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getRideAddress } from '../utils/ride';
import DriverMapView from '../components/DriverMapView';

export default function InRideScreen() {
  const router = useRouter();
  const { activeRide, finishRide } = useDriverRide();

  const handleFinish = async () => {
    Alert.alert('Complete Ride', 'Have you reached the destination and received payment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'COMPLETE RIDE',
        onPress: async () => {
          try {
            await finishRide();
            router.replace('/ride-completed');
          } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to complete ride');
          }
        },
      },
    ]);
  };

  const riderName = activeRide?.user?.fullname
    ? `${activeRide.user.fullname.firstname || ''} ${activeRide.user.fullname.lastname || ''}`.trim()
    : 'Customer';

  return (
    <View style={styles.container}>
      <HeaderBar title="In Ride" showBack />
      <Text style={styles.subHeaderBanner}>Heading to Drop Location</Text>

      {/* Drop Location Card & Customer Info */}
      <View style={[styles.dropCard, Shadows.card]}>
        <View style={styles.addressRow}>
          <Ionicons name="location" size={18} color={Colors.danger} />
          <View style={styles.addressWrapper}>
            <Text style={styles.labelRed}>Drop Location</Text>
            <Text style={styles.addressText}>
              {getRideAddress(activeRide?.destination, 'Destination')}
            </Text>
          </View>
        </View>

        <View style={styles.riderRow}>
          <Ionicons name="person-circle" size={32} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.riderName}>{riderName}</Text>
            <Text style={styles.riderPhone}>{activeRide?.user?.phone || 'Customer'}</Text>
          </View>
          <Text style={styles.fareBadge}>₹{activeRide?.fare || 0}</Text>
        </View>
      </View>

      {/* ✅ Real Map — Pickup to Destination route */}
      <View style={styles.mapCanvas}>
        <DriverMapView
          mode="in-ride"
          pickup={activeRide?.pickup}
          destination={activeRide?.destination}
        />
      </View>

      {/* Bottom Complete Ride Button */}
      <View style={[styles.bottomCard, Shadows.card]}>
        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Trip Fare</Text>
            <Text style={styles.statValue}>₹{activeRide?.fare || 0}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Payment</Text>
            <Text style={styles.statValue}>CASH / ONLINE</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.navigateBtn} onPress={handleFinish}>
          <Text style={styles.btnText}>Complete Ride & Collect Fare</Text>
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  subHeaderBanner: {
    backgroundColor: Colors.primary,
    color: '#FFF',
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.9,
  },
  dropCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: -4,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    zIndex: 10,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressWrapper: { marginLeft: 10, flex: 1 },
  labelRed: { fontSize: 10, fontWeight: '800', color: Colors.danger, textTransform: 'uppercase' },
  addressText: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: Colors.surfaceBorder },
  riderName: { fontSize: 14, fontWeight: '800', color: Colors.textDark },
  riderPhone: { fontSize: 12, color: Colors.textMuted },
  fareBadge: { fontSize: 16, fontWeight: '900', color: Colors.accentGreen },
  mapCanvas: { flex: 1, backgroundColor: '#EBF3FB', alignItems: 'center', justifyContent: 'center' },
  destPin: { marginBottom: 10 },
  navPathHint: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 14,
  },
  bottomCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statCol: { alignItems: 'center' },
  statLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: '900', color: Colors.textDark, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.surfaceBorder },
  navigateBtn: {
    backgroundColor: Colors.accentGreen,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  btnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
