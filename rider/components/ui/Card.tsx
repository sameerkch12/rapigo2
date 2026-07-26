import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: number;
  animated?: boolean;
}

export default function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 16,
  animated = true,
}: CardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (!animated || !onPress) return;
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const onPressOut = () => {
    if (!animated || !onPress) return;
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  const variantStyle: ViewStyle =
    variant === 'elevated'
      ? { ...Shadow.md, borderRadius: Radius.xl }
      : variant === 'outlined'
      ? { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.xl }
      : variant === 'glass'
      ? {
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.6)',
          borderRadius: Radius.xl,
          ...Shadow.sm,
        }
      : { ...Shadow.sm, borderRadius: Radius.xl };

  const content = (
    <Animated.View
      style={[
        styles.card,
        variantStyle,
        { padding },
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
});
