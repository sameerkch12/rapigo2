import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';
const MONTHLY_PLANS: any[] = [];

const { width } = Dimensions.get('window');

const PLAN_GRADIENTS: Record<string, [string, string]> = {
  basic: ['#4F46E5', '#2563EB'],
  premium: ['#8B5CF6', '#6D28D9'],
  ultra: ['#F59E0B', '#DC2626'],
};

export default function MonthlyPassScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const planAnims = useRef(MONTHLY_PLANS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.stagger(
        100,
        planAnims.map((anim) =>
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true })
        )
      ),
    ]).start();
  }, [fadeAnim, planAnims]);

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.background }, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Pass</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Hero Banner */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <LinearGradient
            colors={['#1A1A2E', '#2D3561']}
            style={styles.heroBanner}
          >
            <View>
              <Text style={styles.heroTitle}>Save More,{'\n'}Ride More ⚡</Text>
              <Text style={styles.heroSub}>Plans starting at ₹499/month</Text>
            </View>
            <Text style={styles.heroEmoji}>🎟️</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Up to 45% off</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Plans */}
        {MONTHLY_PLANS.map((plan, index) => {
          const anim = planAnims[index];
          const gradients = PLAN_GRADIENTS[plan.id];

          return (
            <Animated.View
              key={plan.id}
              style={[
                styles.planCard,
                plan.active && styles.planCardActive,
                { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>⭐ Most Popular</Text>
                </View>
              )}
              {plan.active && (
                <View style={[styles.popularBadge, { backgroundColor: Colors.success }]}>
                  <Text style={styles.popularText}>✓ Current Plan</Text>
                </View>
              )}

              <LinearGradient
                colors={gradients}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.planHeader}
              >
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.rides < 999 ? (
                    <Text style={styles.planRides}>{plan.rides} rides included</Text>
                  ) : (
                    <Text style={styles.planRides}>Unlimited rides</Text>
                  )}
                </View>
                <View style={styles.priceBlock}>
                  <Text style={styles.planOriginalPrice}>₹{plan.originalPrice}</Text>
                  <Text style={styles.planPrice}>₹{plan.price}</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
              </LinearGradient>

              {/* Active Plan Progress */}
              {plan.active && (
                <View style={styles.activeSection}>
                  <View style={styles.rideProgress}>
                    <Text style={styles.ridesLeft}>
                      <Text style={styles.ridesLeftNum}>{plan.ridesLeft}</Text> rides remaining
                    </Text>
                    <Text style={styles.expiry}>Expires {plan.expiry}</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(plan.ridesLeft / plan.rides) * 100}%`, backgroundColor: gradients[0] }]} />
                  </View>
                </View>
              )}

              {/* Features */}
              <View style={styles.featureList}>
                    {plan.features.map((f: string, i: number) => (
                  <View key={i} style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={16} color={gradients[0]} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* CTA */}
              <Button
                title={plan.active ? 'Renew Plan' : `Get ${plan.name} Plan`}
                onPress={() => {}}
                variant={plan.active ? 'secondary' : 'primary'}
                fullWidth
                style={plan.active ? { borderColor: gradients[0] } : { backgroundColor: gradients[0], shadowColor: gradients[0] }}
                textStyle={plan.active ? { color: gradients[0] } : {}}
              />
            </Animated.View>
          );
        })}

        {/* Benefits */}
        <Text style={styles.benefitsTitle}>Why Get a Pass?</Text>
        <View style={styles.benefitsGrid}>
          {[
            { icon: 'savings', label: 'Save 40%', sub: 'vs per-ride pricing', color: Colors.success },
            { icon: 'flash-on', label: 'No Surge', sub: 'Fixed fare always', color: Colors.warning },
            { icon: 'cancel', label: 'Free Cancel', sub: 'Up to 3 per day', color: Colors.primary },
            { icon: 'support-agent', label: 'Priority', sub: 'Support 24/7', color: '#8B5CF6' },
          ].map((b) => (
            <View key={b.label} style={styles.benefitCard}>
              <View style={[styles.benefitIcon, { backgroundColor: b.color + '18' }]}>
                <MaterialIcons name={b.icon as any} size={22} color={b.color} />
              </View>
              <Text style={styles.benefitLabel}>{b.label}</Text>
              <Text style={styles.benefitSub}>{b.sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  heroBanner: {
    borderRadius: Radius.xxl,
    padding: 22,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Shadow.lg,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    marginBottom: 6,
    lineHeight: 30,
  },
  heroSub: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.75)',
  },
  heroEmoji: {
    fontSize: 56,
  },
  heroBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  heroBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.md,
  },
  planCardActive: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    alignItems: 'center',
  },
  popularText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  planName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    marginBottom: 4,
  },
  planRides: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: FontWeight.medium,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  planOriginalPrice: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'line-through',
  },
  planPrice: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  planPeriod: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.75)',
  },
  activeSection: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  rideProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ridesLeft: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  ridesLeftNum: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.primary,
  },
  expiry: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  featureList: {
    padding: 16,
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    fontWeight: FontWeight.medium,
  },
  benefitsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 14,
    marginTop: 4,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  benefitCard: {
    width: (width - 42) / 2,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 16,
    alignItems: 'flex-start',
    gap: 8,
    ...Shadow.sm,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  benefitSub: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
  },
});
