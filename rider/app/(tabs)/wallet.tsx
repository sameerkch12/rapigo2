import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

const TRANSACTIONS: any[] = [];
const COUPONS: any[] = [];
const TABS = ['Transactions', 'Coupons', 'Cashback'];

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Transactions');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 10, bounciness: 6 }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Wallet Card */}
        <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#4F46E5', '#2563EB', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletCard}
          >
            <View style={styles.decoCircle1} />
            <View style={styles.decoCircle2} />

            <View style={styles.walletTop}>
              <View>
                <Text style={styles.walletLabel}>Wallet Balance</Text>
                <Text style={styles.walletBalance}>₹{(user?.walletBalance || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.walletBadge}>
                <MaterialIcons name="verified" size={16} color={Colors.white} />
                <Text style={styles.walletBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.walletBottom}>
              <View>
                <Text style={styles.walletCardLabel}>Account Phone</Text>
                <Text style={styles.walletCardNum}>{user?.phone ? `+91 ${user.phone}` : 'RapiGo Wallet'}</Text>
              </View>
              <View>
                <Text style={styles.walletCardLabel}>Status</Text>
                <Text style={styles.walletCardNum}>Active</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.actionsRow, { opacity: fadeAnim }]}>
          {[
            { icon: 'add', label: 'Add Money', color: Colors.primary },
            { icon: 'send', label: 'Transfer', color: Colors.success },
            { icon: 'card-giftcard', label: 'Rewards', color: '#8B5CF6' },
            { icon: 'people', label: 'Refer', color: '#F59E0B' },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '18' }]}>
                <MaterialIcons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === 'Transactions' && (
          <View style={styles.section}>
            {TRANSACTIONS.length > 0 ? (
              TRANSACTIONS.map((txn) => (
                <View key={txn.id} style={styles.txnRow}>
                  <View style={[styles.txnIcon, { backgroundColor: txn.color + '18' }]}>
                    <MaterialIcons name={txn.icon as any} size={20} color={txn.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.txnLabel}>{txn.label}</Text>
                    <Text style={styles.txnDate}>{txn.date}</Text>
                  </View>
                  <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? Colors.success : Colors.error }]}>
                    {txn.type === 'credit' ? '+' : ''}₹{Math.abs(txn.amount)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyWrap}>
                <MaterialIcons name="receipt-long" size={48} color={Colors.text.light} />
                <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                <Text style={styles.emptyDesc}>Your wallet activity will be listed here.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Coupons' && (
          <View style={styles.section}>
            {COUPONS.length > 0 ? (
              COUPONS.map((coupon) => (
                <View key={coupon.id} style={styles.couponCard}>
                  <LinearGradient
                    colors={[Colors.primary + '15', Colors.primaryLight]}
                    style={styles.couponLeft}
                  >
                    <Text style={styles.couponDiscount}>{coupon.discount}</Text>
                    <Text style={styles.couponCategory}>{coupon.category}</Text>
                  </LinearGradient>
                  <View style={styles.couponDivider} />
                  <View style={styles.couponRight}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                    <Text style={styles.couponMin}>Min ₹{coupon.minOrder}</Text>
                    <Text style={styles.couponExpiry}>Exp: {coupon.expiry}</Text>
                    <TouchableOpacity style={styles.couponBtn}>
                      <Text style={styles.couponBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyWrap}>
                <MaterialIcons name="card-giftcard" size={48} color={Colors.text.light} />
                <Text style={styles.emptyTitle}>No Coupons Available</Text>
                <Text style={styles.emptyDesc}>Check back later for special discount codes.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Cashback' && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>💰</Text>
            <Text style={styles.emptyTitle}>Wallet Rewards</Text>
            <Text style={styles.emptyDesc}>Complete rides to earn instant wallet cashback</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  walletCard: {
    margin: 16,
    borderRadius: Radius.xxl,
    padding: 24,
    height: 180,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  decoCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
    right: -40,
    top: -60,
  },
  decoCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: 60,
    bottom: -40,
  },
  walletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'auto',
  },
  walletLabel: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: FontWeight.medium,
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  walletBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    fontWeight: FontWeight.semibold,
  },
  walletBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  walletCardLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 3,
  },
  walletCardNum: {
    fontSize: FontSize.base,
    color: Colors.white,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  section: {
    padding: 16,
    gap: 2,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  txnIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  txnDate: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
  txnAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.extrabold,
  },
  couponCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    ...Shadow.sm,
  },
  couponLeft: {
    width: 110,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponDiscount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.primary,
    textAlign: 'center',
  },
  couponCategory: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  couponDivider: {
    width: 1,
    backgroundColor: Colors.primaryLight,
    marginVertical: 12,
    borderStyle: 'dashed',
  },
  couponRight: {
    flex: 1,
    padding: 16,
    gap: 3,
  },
  couponCode: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  couponMin: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
  couponExpiry: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
  couponBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.md,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  couponBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  emptyWrap: {
    alignItems: 'center',
    padding: 32,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: FontSize.base,
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 16,
  },
});
