import React, { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

interface ServiceCardProps {
  label: string;
  icon: string;
  color: string;
  bg: string;
  onPress: () => void;
}

export default function ServiceCard({ label, icon, color, bg, onPress }: ServiceCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 50 }),
      Animated.timing(shadowAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
    ]).start();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }),
      Animated.timing(shadowAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.iconWrap, { backgroundColor: bg }]}>
          <MaterialIcons name={icon as any} size={26} color={color} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    width: 60,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
