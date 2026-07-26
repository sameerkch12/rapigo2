import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export const StatCard: React.FC<Props> = ({ title, value, icon, color = Colors.primary }) => {
  return (
    <View style={[styles.card, Shadows.small]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 6,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '800',
    marginTop: 2,
  },
});
