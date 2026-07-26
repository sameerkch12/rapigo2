import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

function MenuItem({
  icon,
  label,
  subtitle,
  rightElement,
  color = Colors.text.secondary,
  bg = Colors.background,
  onPress,
}: {
  icon: string;
  label: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  color?: string;
  bg?: string;
  onPress?: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.8}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: bg }]}>
          <MaterialIcons name={icon as any} size={20} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuLabel}>{label}</Text>
          {subtitle ? <Text style={styles.menuSub}>{subtitle}</Text> : null}
        </View>
        {rightElement ?? <MaterialIcons name="chevron-right" size={20} color={Colors.text.light} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(cardAnim, { toValue: 0, useNativeDriver: true, speed: 10, bounciness: 5 }),
    ]).start();
  }, [cardAnim, fadeAnim]);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout();
      router.replace('/login');
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
      ]);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile Card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: cardAnim }] }]}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.profileCard}
          >
            <View style={styles.profileTop}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: user?.avatar }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={300}
                />
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <MaterialIcons name="camera-alt" size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userPhone}>{user?.phone}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{user?.rating} rating</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <MaterialIcons name="edit" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>{user?.totalRides}</Text>
                <Text style={styles.statLbl}>Rides</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>₹{user?.walletBalance?.toFixed(0)}</Text>
                <Text style={styles.statLbl}>Wallet</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>Premium</Text>
                <Text style={styles.statLbl}>Plan</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Sections */}
        <Animated.View style={[{ opacity: fadeAnim }]}>
          {/* Account */}
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="person-outline" label="Personal Info" subtitle={user?.email} bg={Colors.primaryLight} color={Colors.primary} />
            <MenuItem icon="place" label="Saved Places" subtitle="Home, Work, 1 more" bg="#DCFCE7" color={Colors.success} />
            <MenuItem icon="emergency" label="Emergency Contacts" subtitle="2 contacts added" bg={Colors.errorLight} color={Colors.error} />
          </View>

          {/* Preferences */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="language" label="Language" subtitle="English" bg={Colors.warningLight} color={Colors.warning} />
            <MenuItem icon="dark-mode" label="Dark Mode" bg="#EDE9FE" color="#8B5CF6" rightElement={<Switch value={false} trackColor={{ true: Colors.primary }} />} />
            <MenuItem
              icon="notifications"
              label="Notifications"
              subtitle="All enabled"
              bg={Colors.primaryLight}
              color={Colors.primary}
              onPress={() => router.push('/settings')}
            />
          </View>

          {/* Ride Pass */}
          <TouchableOpacity onPress={() => router.push('/monthly-pass')} style={styles.passCard} activeOpacity={0.85}>
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.passGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View>
                <Text style={styles.passTitle}>Premium Pass Active ⚡</Text>
                <Text style={styles.passSub}>23 rides remaining · Exp Aug 19</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Support */}
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="help-outline" label="Help & FAQ" bg={Colors.primaryLight} color={Colors.primary} />
            <MenuItem icon="headset-mic" label="Contact Support" bg={Colors.successLight} color={Colors.success} />
            <MenuItem icon="star-outline" label="Rate the App" bg={Colors.warningLight} color={Colors.warning} />
            <MenuItem icon="info-outline" label="About RideApp" subtitle="v1.0.0" bg={Colors.background} color={Colors.text.secondary} />
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>Member since {user?.memberSince}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileCard: {
    margin: 16,
    borderRadius: Radius.xxl,
    padding: 20,
    ...Shadow.lg,
    overflow: 'hidden',
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: FontWeight.semibold,
  },
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statVal: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    marginBottom: 2,
  },
  statLbl: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: FontWeight.medium,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text.light,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 1,
  },
  menuSub: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
  passCard: {
    margin: 16,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.md,
  },
  passGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  passTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  passSub: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    margin: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  logoutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.error,
  },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.text.light,
    marginBottom: 8,
  },
});
