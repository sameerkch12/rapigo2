import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDriverRide } from '../contexts/DriverRideContext';
import { CustomerCard } from '../components/CustomerCard';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RideCompletedScreen() {
  const router = useRouter();
  const { activeRide, setActiveRide } = useDriverRide();

  const fare = activeRide?.fare || 54;
  const paymentMethod = (activeRide?.paymentMethod || 'Cash').toUpperCase();

  const handleGoOnline = () => {
    setActiveRide(null);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Top Deep Blue Hero Header */}
      <View style={styles.heroHeader}>
        <Text style={styles.heroTitle}>Ride Completed</Text>
      </View>

      {/* Large Green Checkmark Graphic */}
      <View style={styles.checkCardWrapper}>
        <View style={[styles.checkCircle, Shadows.glowGreen]}>
          <Ionicons name="checkmark-sharp" size={48} color="#FFF" />
        </View>
        <Text style={styles.completedSubTitle}>Ride Completed</Text>
      </View>

      <View style={styles.contentPadding}>
        {/* Customer Info Card */}
        <CustomerCard name={activeRide?.rider?.name || 'Rahul Sharma'} />

        {/* Payment Details Card */}
        <View style={[styles.paymentCard, Shadows.card]}>
          <Text style={styles.paymentTitle}>Payment Details</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Fare</Text>
            <Text style={styles.rowValue}>₹{fare}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Paid To You</Text>
            <Text style={styles.rowValueBold}>₹{fare}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment Method</Text>
            <View style={styles.cashBadge}>
              <Text style={styles.cashText}>{paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Thank You Note */}
        <View style={styles.thankYouBox}>
          <Text style={styles.thankYouTitle}>Thank you!</Text>
          <Text style={styles.thankYouSub}>Have a great day ahead.</Text>
        </View>
      </View>

      {/* Bottom Go Online Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.goOnlineBtn} onPress={handleGoOnline}>
          <Text style={styles.btnText}>Go Online</Text>
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
  heroHeader: {
    backgroundColor: Colors.primary,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  checkCardWrapper: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 10,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  completedSubTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textDark,
    marginTop: 10,
  },
  contentPadding: {
    paddingHorizontal: 20,
    flex: 1,
  },
  paymentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textDark,
  },
  rowValueBold: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textDark,
  },
  cashBadge: {
    backgroundColor: Colors.accentGreenLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  cashText: {
    color: Colors.accentGreen,
    fontWeight: '800',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceBorder,
    marginVertical: 4,
  },
  thankYouBox: {
    alignItems: 'center',
    marginTop: 24,
  },
  thankYouTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textDark,
  },
  thankYouSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
  },
  goOnlineBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
