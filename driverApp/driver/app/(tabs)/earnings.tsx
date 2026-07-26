import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Colors, Shadows } from '../../constants/theme';
import { StatCard } from '../../components/StatCard';
import { Ionicons } from '@expo/vector-icons';
import { useDriverAuth } from '../../contexts/DriverAuthContext';

export default function EarningsScreen() {
  const { driver } = useDriverAuth();

  const rides = Array.isArray(driver?.rides) ? driver.rides : [];
  const completedRides = rides.filter((r: any) => typeof r === 'object' && r.status === 'completed');
  
  const totalEarnings = completedRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0);
  const totalRideCount = completedRides.length;

  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>TOTAL WEEKLY EARNINGS</Text>
        <Text style={styles.summaryAmount}>₹{totalEarnings.toLocaleString('en-IN')}.00</Text>
        <Text style={styles.summarySub}>Payout scheduled for Monday</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard title="This Week" value={`${totalRideCount} Rides`} icon="bar-chart-outline" color={Colors.primary} />
        <StatCard title="Bonus Earned" value="₹0" icon="trophy-outline" color={Colors.accent} />
      </View>

      <Text style={styles.sectionTitle}>RECENT COMPLETED TRIPS</Text>

      <FlatList
        data={completedRides}
        keyExtractor={(item: any) => item._id || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No completed trips yet</Text>
            <Text style={styles.emptySub}>Your completed trip earnings will appear here.</Text>
          </View>
        }
        renderItem={({ item }: { item: any }) => (
          <View style={[styles.tripCard, Shadows.small]}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripDate}>
                {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Trip'}
              </Text>
              <Text style={styles.tripFare}>+₹{item.fare || 0}</Text>
            </View>
            <View style={styles.tripRow}>
              <Ionicons name="radio-button-on" size={14} color={Colors.primary} />
              <Text style={styles.tripText} numberOfLines={1}>{item.pickup || 'Pickup location'}</Text>
            </View>
            <View style={styles.tripRow}>
              <Ionicons name="location" size={14} color={Colors.danger} />
              <Text style={styles.tripText} numberOfLines={1}>{item.destination || 'Destination'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  summaryBox: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
    marginVertical: 6,
  },
  summarySub: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  listContent: {
    gap: 12,
  },
  tripCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tripDate: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  tripFare: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  tripText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  emptyBox: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textDark,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});

