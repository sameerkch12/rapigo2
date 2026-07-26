import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDriverAuth } from '../../contexts/DriverAuthContext';
import { Colors, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { driver, logout } = useDriverAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of your driver account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.profileCard, Shadows.medium]}>
        <View style={styles.avatarBox}>
          <Ionicons name="person" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.name}>
          {driver?.fullname
            ? `${driver.fullname.firstname} ${driver.fullname.lastname || ''}`.trim()
            : (driver?.name || 'Captain Driver')}
        </Text>

        <Text style={styles.phone}>+91 {driver?.phone}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.statusBadge}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>{driver?.isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.ratingText}>{driver?.rating || 5.0} Rating</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>VEHICLE SPECIFICATIONS</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category</Text>
          <Text style={styles.infoValue}>{driver?.vehicleType?.toUpperCase()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Registration No.</Text>
          <Text style={styles.infoValue}>{driver?.vehicle?.registrationNumber || 'N/A'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Make & Model</Text>
          <Text style={styles.infoValue}>{driver?.vehicle?.make || 'Standard Vehicle'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>LOG OUT OF CAPTAIN APP</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  avatarBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  phone: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '22',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  statusText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '22',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    gap: 4,
  },
  ratingText: {
    color: Colors.accent,
    fontWeight: '800',
    fontSize: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger + '15',
    borderWidth: 1,
    borderColor: Colors.danger,
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
