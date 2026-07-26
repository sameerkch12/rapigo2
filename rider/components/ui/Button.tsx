import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  const sizeStyles: Record<string, ViewStyle> = {
    sm: { height: 40, paddingHorizontal: 16, borderRadius: Radius.md },
    md: { height: 52, paddingHorizontal: 24, borderRadius: Radius.lg },
    lg: { height: 58, paddingHorizontal: 32, borderRadius: Radius.xl },
  };

  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: disabled ? Colors.primaryMid : Colors.primary,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 14,
      elevation: 8,
    },
    secondary: {
      backgroundColor: Colors.white,
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    ghost: {
      backgroundColor: Colors.primaryLight,
    },
    danger: {
      backgroundColor: Colors.error,
      shadowColor: Colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  };

  const textVariantStyles: Record<string, TextStyle> = {
    primary: { color: Colors.white },
    secondary: { color: Colors.primary },
    ghost: { color: Colors.primary },
    danger: { color: Colors.white },
  };

  const textSizeStyles: Record<string, TextStyle> = {
    sm: { fontSize: 13, fontWeight: FontWeight.semibold },
    md: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
    lg: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, fullWidth && { width: '100%' }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && { width: '100%' },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.primary} size="small" />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, textVariantStyles[variant], textSizeStyles[size], textStyle]}>
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    letterSpacing: 0.3,
  },
});
