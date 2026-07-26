import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/theme';
const OFFER_BANNERS: any[] = [];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function OfferCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % OFFER_BANNERS.length;
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.7, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      scrollRef.current?.scrollTo({ x: next * (CARD_WIDTH + 12), animated: true });
      setActiveIndex(next);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeIndex, fadeAnim]);

  if (OFFER_BANNERS.length === 0) return null;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + 12));
          setActiveIndex(idx);
        }}
      >
        {OFFER_BANNERS.map((banner) => (
          <Animated.View key={banner.id} style={[styles.card, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={banner.bg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <View style={styles.content}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{banner.title}</Text>
                  <Text style={styles.subtitle}>{banner.subtitle}</Text>
                </View>
                <Text style={styles.emoji}>{banner.emoji}</Text>
              </View>
              <View style={styles.decorCircle} />
              <View style={styles.decorCircle2} />
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {OFFER_BANNERS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: 110,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: FontWeight.medium,
  },
  emoji: {
    fontSize: 44,
  },
  decorCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    right: -20,
    bottom: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.07)',
    right: 50,
    top: -20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  dotInactive: {
    backgroundColor: Colors.border,
    width: 6,
  },
});
