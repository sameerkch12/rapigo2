import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { RouteTimeline } from './RouteTimeline';
import { Ionicons } from '@expo/vector-icons';
import { getRideAddress, getRideDistanceKm } from '../utils/ride';

interface Props {
  request: any;
  onAccept: (id: string) => void;
  onClose?: (id: string) => void;
}

export const RideRequestFeedCard: React.FC<Props> = ({ request, onAccept, onClose }) => {
  const reqId = request._id || request.id;
  const fare = request.fare || 54;
  const paymentMethod = (request.paymentMethod || 'Cash').toUpperCase();
  const distanceKm = request.distanceKm || getRideDistanceKm(request.distance);

  return (
    <View style={[styles.card, Shadows.card]}>
      {/* Top Banner Tag */}
      <View style={styles.topTagRow}>
        <Text style={styles.topTagText}>New Ride Request</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={() => onClose(reqId)}>
            <Ionicons name="close" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Body */}
      <View style={styles.bodyRow}>
        {/* Left Side Fare Badge */}
        <View style={styles.fareBox}>
          <Text style={styles.youReceiveLabel}>You will receive</Text>
          <Text style={styles.fareAmount}>₹{fare}</Text>
          <View style={styles.cashBadge}>
            <Text style={styles.cashText}>{paymentMethod}</Text>
          </View>
        </View>

        {/* Right Side Route Timeline */}
        <View style={styles.timelineWrapper}>
          <RouteTimeline
            pickupAddress={getRideAddress(request.pickup, 'Pickup Point')}
            dropAddress={getRideAddress(request.destination, 'Drop Point')}
            pickupDistance={request.pickupDistanceKm ? `${request.pickupDistanceKm} km` : '1.2 km'}
            totalDistance={distanceKm ? `${distanceKm} km` : undefined}
          />
        </View>
      </View>

      {/* Bottom Accept Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.acceptBtn, Shadows.button]}
        onPress={() => onAccept(reqId)}
      >
        <View style={styles.btnLeft}>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.acceptText}>Accept Ride</Text>
        </View>
        <Text style={styles.btnTagText}>You will receive ₹{fare}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  topTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 2,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  fareBox: {
    width: 95,
    alignItems: 'flex-start',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceBorder,
  },
  youReceiveLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    marginVertical: 2,
  },
  cashBadge: {
    backgroundColor: Colors.accentGreenLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cashText: {
    color: Colors.accentGreen,
    fontWeight: '800',
    fontSize: 10,
  },
  timelineWrapper: {
    flex: 1,
    paddingLeft: 10,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  btnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  acceptText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  btnTagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.9,
  },
});
