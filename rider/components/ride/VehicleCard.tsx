import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontWeight, Radius } from '@/constants/theme';

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    emoji: string;
    description: string;
    eta: number;
    seats: number;
    rating: number;
    tag: string;
    tagColor: string;
  };
  fare: number;
  selected: boolean;
  onSelect: () => void;
}

export default function VehicleCard({ vehicle, fare, selected, onSelect }: VehicleCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Pressable onPress={onSelect} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.card,
          selected ? styles.cardSelected : styles.cardUnselected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Left Vehicle Icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.emoji}>{vehicle.emoji}</Text>
        </View>

        {/* Middle Details */}
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{vehicle.name}</Text>
            {vehicle.tag ? (
              <View style={[styles.tagPill, { backgroundColor: vehicle.tagColor + '15' }]}>
                <Text style={[styles.tagText, { color: vehicle.tagColor }]}>{vehicle.tag}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.subInfoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="person-outline" size={13} color="#94A3B8" />
              <Text style={styles.infoText}>{vehicle.seats} {vehicle.seats === 1 ? 'seat' : 'seats'}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <View style={styles.infoItem}>
              <MaterialIcons name="access-time" size={13} color="#94A3B8" />
              <Text style={styles.infoText}>{vehicle.eta} min</Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={13} color="#F59E0B" />
            <Text style={styles.ratingText}>{vehicle.rating}</Text>
          </View>
        </View>

        {/* Right Price & Selected Indicator */}
        <View style={styles.right}>
          <Text style={styles.fare}>₹{fare}</Text>
          {selected && (
            <View style={styles.checkCircle}>
              <MaterialIcons name="check" size={14} color="#FFFFFF" />
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFF',
  },
  cardUnselected: {
    borderColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    width: 60,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 34,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: FontWeight.extrabold,
    color: '#0F172A',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: FontWeight.medium,
  },
  dot: {
    color: '#CBD5E1',
    fontSize: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: FontWeight.bold,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fare: {
    fontSize: 22,
    fontWeight: FontWeight.extrabold,
    color: '#0F172A',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
