import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getRideAddress, getRideDistanceKm } from '../utils/ride';

interface Props {
  ride: any;
  onOpenRide: () => void;
  onVerifyOtpPress: () => void;
}

export const RideRequestCard: React.FC<Props> = ({ ride, onOpenRide, onVerifyOtpPress }) => {
  if (!ride) return null;

  const isAssigned = ride.status === 'driver_assigned';
  const isOngoing = ride.status === 'ongoing';
  const distanceKm = ride.distanceKm || getRideDistanceKm(ride.distance);

  return (
    <View style={[styles.card, Shadows.medium]}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isAssigned ? 'NEW TRIP ASSIGNED' : 'ONGOING TRIP'}
          </Text>
        </View>
        <Text style={styles.fare}>₹{ride.fare}</Text>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <Ionicons name="radio-button-on" size={18} color={Colors.primary} />
          <Text style={styles.addressText} numberOfLines={1}>
            {getRideAddress(ride.pickup, 'Pickup Location')}
          </Text>
        </View>
        <View style={styles.lineDivider} />
        <View style={styles.addressRow}>
          <Ionicons name="location" size={18} color={Colors.danger} />
          <Text style={styles.addressText} numberOfLines={1}>
            {getRideAddress(ride.destination, 'Destination Location')}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Distance: {distanceKm || '--'} km</Text>
        <Text style={styles.metaText}>Payment: {ride.paymentMethod?.toUpperCase()}</Text>
      </View>

      <View style={styles.actionRow}>
        {isAssigned ? (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
            onPress={onVerifyOtpPress}
          >
            <Ionicons name="key-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnText}>ENTER OTP TO START</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.secondary }]}
            onPress={onOpenRide}
          >
            <Ionicons name="navigate-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnText}>NAVIGATE & COMPLETE</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: Colors.primary + '22',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badgeText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  fare: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.accent,
  },
  addressContainer: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  lineDivider: {
    height: 16,
    width: 2,
    backgroundColor: Colors.border,
    marginLeft: 8,
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
