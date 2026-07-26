import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDriverRide } from '../contexts/DriverRideContext';
import { useDriverAuth } from '../contexts/DriverAuthContext';
import { socketService } from '../services/socket';
import { Colors, Shadows } from '../constants/theme';
import { OtpModal } from '../components/OtpModal';
import { Ionicons } from '@expo/vector-icons';
import { getRideAddress } from '../utils/ride';

export default function ActiveRideScreen() {
  const router = useRouter();
  const { activeRide, verifyOtp, finishRide } = useDriverRide();
  const { driver } = useDriverAuth(); // ✅ FIX: captainId lene ke liye
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Simulated GPS streaming interval for live driver tracking
  useEffect(() => {
    if (!activeRide?._id) return;

    let baseLat = activeRide.pickup?.latitude || 21.2514;
    let baseLng = activeRide.pickup?.longitude || 81.6296;

    const interval = setInterval(() => {
      // Slightly shift position towards destination
      baseLat += 0.0001;
      baseLng += 0.0001;
      // ✅ FIX: captainId pehle pass karo — naya signature: (captainId, rideId, ltd, lng, heading)
      if (driver?._id) {
        socketService.updateLocation(driver._id, activeRide._id, baseLat, baseLng, 45);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeRide]);

  if (!activeRide) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle-outline" size={64} color={Colors.primary} />
        <Text style={styles.emptyTitle}>NO ACTIVE TRIP</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.backBtnText}>RETURN TO DASHBOARD</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAssigned = activeRide.status === 'driver_assigned';
  const isOngoing = activeRide.status === 'ongoing';

  const handleFinishRide = async () => {
    Alert.alert('Complete Trip', 'Are you sure you want to finish this trip and collect payment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'COMPLETE TRIP',
        style: 'default',
        onPress: async () => {
          setIsFinishing(true);
          try {
            const res = await finishRide();
            if (res.success) {
              Alert.alert('Trip Completed!', `Trip total ₹${activeRide.fare} collected successfully.`);
              router.replace('/(tabs)');
            } else {
              Alert.alert('Error', res.message || 'Failed to finish trip');
            }
          } finally {
            setIsFinishing(false);
          }
        },
      },
    ]);
  };

  const handleVerifyOtpSubmit = async (otp: string) => {
    const res = await verifyOtp(otp);
    if (!res.success) {
      throw new Error(res.message || 'Invalid OTP');
    }
    Alert.alert('Trip Started!', 'OTP verified successfully. Drive safely!');
  };

  return (
    <View style={styles.container}>
      {/* Visual Navigation Map Placeholder Card */}
      <View style={styles.mapCard}>
        <View style={styles.mapOverlayHeader}>
          <View style={styles.navBadge}>
            <Ionicons name="navigate-sharp" size={18} color="#FFF" />
            <Text style={styles.navText}>
              {isAssigned ? 'EN ROUTE TO PICKUP' : 'TRIP IN PROGRESS TO DESTINATION'}
            </Text>
          </View>
        </View>
        <View style={styles.mapCenterGraphic}>
          <Ionicons name="car-sport" size={64} color={Colors.primary} />
          <Text style={styles.gpsStreamingText}>GPS Streaming Active • 10s Throttle</Text>
        </View>
      </View>

      {/* Customer & Address Details Card */}
      <View style={[styles.detailsCard, Shadows.medium]}>
        <View style={styles.customerRow}>
          <View style={styles.customerAvatar}>
            <Ionicons name="person" size={24} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>{activeRide.rider?.name || 'Rider Customer'}</Text>
            <Text style={styles.customerPhone}>+91 {activeRide.rider?.phone || 'Customer'}</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeRow}>
            <Ionicons name="radio-button-on" size={18} color={Colors.primary} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>PICKUP LOCATION</Text>
              <Text style={styles.routeAddress}>{getRideAddress(activeRide.pickup, 'Pickup location')}</Text>
            </View>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeRow}>
            <Ionicons name="location" size={18} color={Colors.danger} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>DESTINATION LOCATION</Text>
              <Text style={styles.routeAddress}>{getRideAddress(activeRide.destination, 'Drop location')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Trip Fare ({activeRide.paymentMethod?.toUpperCase()})</Text>
          <Text style={styles.fareAmount}>₹{activeRide.fare}</Text>
        </View>

        {isAssigned ? (
          <TouchableOpacity style={styles.startBtn} onPress={() => setOtpModalVisible(true)}>
            <Ionicons name="key" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.startBtnText}>ENTER OTP TO START TRIP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.completeBtn} onPress={handleFinishRide} disabled={isFinishing}>
            {isFinishing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.completeBtnText}>COMPLETE & COLLECT PAYMENT</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      <OtpModal
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        onVerify={handleVerifyOtpSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
    marginTop: 16,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 20,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '800',
  },
  mapCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapOverlayHeader: {
    position: 'absolute',
    top: 16,
    alignItems: 'center',
  },
  navBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  navText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  mapCenterGraphic: {
    alignItems: 'center',
  },
  gpsStreamingText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  customerName: {
    color: Colors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  customerPhone: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  routeLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  routeAddress: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  routeDivider: {
    height: 16,
    width: 2,
    backgroundColor: Colors.border,
    marginLeft: 8,
    marginVertical: 2,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  fareLabel: {
    color: Colors.textMuted,
    fontWeight: '700',
    fontSize: 14,
  },
  fareAmount: {
    color: Colors.accent,
    fontWeight: '900',
    fontSize: 22,
  },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  completeBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
