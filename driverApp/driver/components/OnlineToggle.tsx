import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  isOnline: boolean;
  onToggle: () => void;
}

export const OnlineToggle: React.FC<Props> = ({ isOnline, onToggle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={[
        styles.button,
        isOnline ? styles.onlineButton : styles.offlineButton,
        isOnline && Shadows.glow,
      ]}
    >
      <View style={[styles.indicator, isOnline ? styles.onlineDot : styles.offlineDot]} />
      <Text style={styles.text}>{isOnline ? 'YOU ARE ONLINE' : 'GO ONLINE'}</Text>
      <Ionicons
        name={isOnline ? 'power-sharp' : 'power-outline'}
        size={22}
        color={Colors.text}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  onlineButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  offlineButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  onlineDot: {
    backgroundColor: '#FFFFFF',
  },
  offlineDot: {
    backgroundColor: Colors.danger,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
