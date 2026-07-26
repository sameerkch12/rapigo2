import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '@/services/auth.service';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';
import Badge from '@/components/ui/Badge';

const TABS = ['All', 'Completed', 'Cancelled'];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [rides, setRides] = useState<any[]>([]);

  const fetchRides = async () => {
    try {
      const res = await authService.getProfile();
      if (res && res.user && Array.isArray(res.user.rides)) {
        setRides(res.user.rides);
      }
    } catch {
      setRides([]);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    fetchRides();
  }, [fadeAnim]);

  const filteredRides = rides.map((ride: any) => ({
    id: ride._id || ride.id,
    type: ride.vehicle || 'Ride',
    status: ride.status || 'completed',
    date: ride.createdAt ? new Date(ride.createdAt).toLocaleString() : 'Recent',
    from: ride.pickup || 'Pickup location',
    to: ride.destination || 'Destination',
    fare: ride.fare || 0,
    distance: ride.distance ? `${Math.round(ride.distance / 100) / 10} km` : '3.2 km',
  })).filter((r) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return r.status === 'completed';
    if (activeTab === 'Cancelled') return r.status === 'cancelled';
    return true;
  });

  const statusColor = (status: string) =>
    status === 'completed' ? Colors.success : status === 'cancelled' ? Colors.error : Colors.warning;
  const statusBg = (status: string) =>
    status === 'completed' ? Colors.successLight : status === 'cancelled' ? Colors.errorLight : Colors.warningLight;

  const typeEmoji = (type: string) =>
    type.toLowerCase().includes('bike') ? '🏍️' : type.toLowerCase().includes('auto') ? '🛺' : '🚗';

  const renderRide = ({ item, index }: any) => {
    return (
      <View style={styles.rideCard}>
        <View style={styles.rideLeft}>
          <View style={styles.emojiWrap}>
            <Text style={styles.rideEmoji}>{typeEmoji(item.type)}</Text>
          </View>
        </View>
        <View style={styles.rideContent}>
          <View style={styles.rideHeader}>
            <Text style={styles.rideType}>{item.type.toUpperCase()} Ride</Text>
            <Badge
              label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              color={statusColor(item.status)}
              bg={statusBg(item.status)}
            />
          </View>
          <Text style={styles.rideDate}>{item.date}</Text>
          <View style={styles.routeWrap}>
            <View style={styles.routeItem}>
              <View style={styles.greenDot} />
              <Text style={styles.routeText} numberOfLines={1}>{item.from}</Text>
            </View>
            <View style={styles.routeItem}>
              <View style={styles.redDot} />
              <Text style={styles.routeText} numberOfLines={1}>{item.to}</Text>
            </View>
          </View>
          <View style={styles.rideFooter}>
            <View style={styles.rideFooterItem}>
              <MaterialIcons name="straighten" size={13} color={Colors.text.light} />
              <Text style={styles.rideMeta}>{item.distance}</Text>
            </View>
            {item.fare > 0 && <Text style={styles.rideFare}>₹{item.fare}</Text>}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.headerTitle}>Your Activity</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item.id}
        renderItem={renderRide}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={48} color={Colors.text.light} />
            <Text style={styles.emptyText}>No rides found in activity.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 16 },
  headerTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text.primary, marginBottom: 14 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: Radius.md, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.sm },
  activeTab: { backgroundColor: '#FFF', ...Shadow.sm },
  tabText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, color: Colors.text.secondary },
  activeTabText: { color: Colors.primary, fontWeight: FontWeight.bold },
  rideCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: Radius.md, padding: 14, marginBottom: 12, ...Shadow.sm, gap: 12 },
  rideLeft: { alignItems: 'center' },
  emojiWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  rideEmoji: { fontSize: 20 },
  rideContent: { flex: 1 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rideType: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text.primary },
  rideDate: { fontSize: 11, color: Colors.text.secondary, marginVertical: 2 },
  routeWrap: { marginVertical: 6, gap: 4 },
  routeItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  redDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.error },
  routeText: { fontSize: FontSize.xs, color: Colors.text.primary, flex: 1 },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  rideFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rideMeta: { fontSize: 11, color: Colors.text.secondary },
  rideFare: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 10, fontSize: FontSize.sm, color: Colors.text.secondary },
});
