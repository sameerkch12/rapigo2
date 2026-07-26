import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

function SettingRow({
  icon,
  label,
  subtitle,
  hasSwitch,
  switchValue,
  onSwitchChange,
  iconBg,
  iconColor,
  destructive,
  onPress,
}: {
  icon: string;
  label: string;
  subtitle?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  iconBg?: string;
  iconColor?: string;
  destructive?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg ?? Colors.background }]}>
        <MaterialIcons name={icon as any} size={20} color={iconColor ?? Colors.text.secondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, destructive && { color: Colors.error }]}>{label}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ true: Colors.primary, false: Colors.border }}
          thumbColor={Colors.white}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={20} color={Colors.text.light} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [notifications, setNotifications] = useState({
    rideUpdates: true,
    offers: true,
    payments: true,
    news: false,
    sms: true,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const toggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      alert('Account deletion requires contacting support.');
    } else {
      Alert.alert('Delete Account', 'This action cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]);
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.background }, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        style={{ opacity: fadeAnim }}
      >
        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow
            icon="directions-bike"
            label="Ride Updates"
            subtitle="Status, driver arrival, completion"
            hasSwitch
            switchValue={notifications.rideUpdates}
            onSwitchChange={() => toggle('rideUpdates')}
            iconBg={Colors.primaryLight}
            iconColor={Colors.primary}
          />
          <SettingRow
            icon="local-offer"
            label="Offers & Deals"
            subtitle="Coupons, cashback alerts"
            hasSwitch
            switchValue={notifications.offers}
            onSwitchChange={() => toggle('offers')}
            iconBg={Colors.warningLight}
            iconColor={Colors.warning}
          />
          <SettingRow
            icon="payment"
            label="Payments"
            subtitle="Transaction confirmations"
            hasSwitch
            switchValue={notifications.payments}
            onSwitchChange={() => toggle('payments')}
            iconBg={Colors.successLight}
            iconColor={Colors.success}
          />
          <SettingRow
            icon="newspaper"
            label="News & Updates"
            subtitle="App updates, blog posts"
            hasSwitch
            switchValue={notifications.news}
            onSwitchChange={() => toggle('news')}
            iconBg={Colors.background}
            iconColor={Colors.text.secondary}
          />
          <SettingRow
            icon="sms"
            label="SMS Alerts"
            subtitle="Critical alerts via SMS"
            hasSwitch
            switchValue={notifications.sms}
            onSwitchChange={() => toggle('sms')}
            iconBg="#EDE9FE"
            iconColor="#8B5CF6"
          />
        </View>

        {/* Privacy */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.card}>
          <SettingRow
            icon="location-on"
            label="Location Permissions"
            subtitle="Always on"
            iconBg={Colors.successLight}
            iconColor={Colors.success}
          />
          <SettingRow
            icon="lock"
            label="Change PIN"
            iconBg={Colors.primaryLight}
            iconColor={Colors.primary}
          />
          <SettingRow
            icon="fingerprint"
            label="Biometric Login"
            hasSwitch
            switchValue={true}
            iconBg="#EDE9FE"
            iconColor="#8B5CF6"
          />
          <SettingRow
            icon="visibility-off"
            label="Privacy Settings"
            iconBg={Colors.background}
            iconColor={Colors.text.secondary}
          />
        </View>

        {/* App */}
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.card}>
          <SettingRow
            icon="language"
            label="Language"
            subtitle="English"
            iconBg={Colors.warningLight}
            iconColor={Colors.warning}
          />
          <SettingRow
            icon="storage"
            label="Clear Cache"
            subtitle="12.4 MB"
            iconBg={Colors.background}
            iconColor={Colors.text.secondary}
          />
          <SettingRow
            icon="info"
            label="App Version"
            subtitle="v1.0.0 (Build 100)"
            iconBg={Colors.primaryLight}
            iconColor={Colors.primary}
          />
        </View>

        {/* Legal */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.card}>
          <SettingRow
            icon="gavel"
            label="Terms of Service"
            iconBg={Colors.background}
            iconColor={Colors.text.secondary}
          />
          <SettingRow
            icon="policy"
            label="Privacy Policy"
            iconBg={Colors.background}
            iconColor={Colors.text.secondary}
          />
          <SettingRow
            icon="description"
            label="Cookie Policy"
            iconBg={Colors.background}
            iconColor={Colors.text.secondary}
          />
        </View>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.card}>
          <SettingRow
            icon="delete-forever"
            label="Delete Account"
            subtitle="Permanently remove your account"
            destructive
            iconBg={Colors.errorLight}
            iconColor={Colors.error}
            onPress={handleDeleteAccount}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text.light,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
    paddingLeft: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 1,
  },
  rowSub: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
});
