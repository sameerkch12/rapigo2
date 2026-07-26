import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function Badge({ label, color = Colors.primary, bg = Colors.primaryLight, size = 'sm', style }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'md' && styles.md, style]}>
      <Text style={[styles.text, { color }, size === 'md' && styles.mdText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  mdText: {
    fontSize: FontSize.sm,
  },
});
