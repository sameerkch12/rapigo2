import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { Colors, FontSize, FontWeight, Radius, Shadow } from '@/constants/theme';

const PARCEL_TYPES = [
  { id: 'doc', label: 'Document', icon: 'description', color: Colors.primary },
  { id: 'food', label: 'Food', icon: 'fastfood', color: Colors.warning },
  { id: 'clothes', label: 'Clothing', icon: 'checkroom', color: '#8B5CF6' },
  { id: 'electronics', label: 'Electronics', icon: 'devices', color: Colors.success },
  { id: 'medicine', label: 'Medicine', icon: 'local-pharmacy', color: Colors.error },
  { id: 'other', label: 'Other', icon: 'inventory-2', color: Colors.text.secondary },
];

const WEIGHTS = ['< 1 kg', '1–3 kg', '3–5 kg', '5–10 kg', '> 10 kg'];

export default function ParcelScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [parcelType, setParcelType] = useState('doc');
  const [weight, setWeight] = useState('< 1 kg');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [instructions, setInstructions] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const priceAnim = useRef(new Animated.Value(0)).current;

  const getPrice = () => {
    const baseMap: Record<string, number> = { '< 1 kg': 49, '1–3 kg': 79, '3–5 kg': 119, '5–10 kg': 179, '> 10 kg': 249 };
    return baseMap[weight] ?? 49;
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(priceAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(priceAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [priceAnim, weight]);

  return (
    <Animated.View style={[{ flex: 1, backgroundColor: Colors.background, opacity: fadeAnim }, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Parcel</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Locations */}
        <View style={styles.locCard}>
          <View style={styles.locRow}>
            <View style={styles.greenDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.locLabel}>Pickup Location</Text>
              <Text style={styles.locText}>Koramangala, Bangalore</Text>
            </View>
            <MaterialIcons name="edit" size={16} color={Colors.primary} />
          </View>
          <View style={styles.locDivider} />
          <View style={styles.locRow}>
            <View style={styles.redDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.locLabel}>Delivery Location</Text>
              <Text style={[styles.locText, { color: Colors.text.light }]}>Enter address</Text>
            </View>
            <MaterialIcons name="add" size={16} color={Colors.primary} />
          </View>
        </View>

        {/* Parcel Type */}
        <Text style={styles.sectionTitle}>Parcel Type</Text>
        <View style={styles.typeGrid}>
          {PARCEL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeCard, parcelType === type.id && styles.typeCardActive]}
              onPress={() => setParcelType(type.id)}
            >
              <MaterialIcons name={type.icon as any} size={24} color={parcelType === type.id ? Colors.white : type.color} />
              <Text style={[styles.typeLabel, parcelType === type.id && { color: Colors.white }]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight */}
        <Text style={styles.sectionTitle}>Weight</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {WEIGHTS.map((w) => (
            <TouchableOpacity
              key={w}
              style={[styles.weightChip, weight === w && styles.weightChipActive]}
              onPress={() => setWeight(w)}
            >
              <Text style={[styles.weightText, weight === w && { color: Colors.white }]}>{w}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Receiver Details */}
        <Text style={styles.sectionTitle}>Receiver Details</Text>
        <View style={styles.inputGroup}>
          <View style={styles.inputWrap}>
            <MaterialIcons name="person" size={20} color={Colors.text.light} />
            <TextInput
              style={styles.input}
              placeholder="Receiver Name"
              placeholderTextColor={Colors.text.light}
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>
          <View style={styles.inputWrap}>
            <MaterialIcons name="phone" size={20} color={Colors.text.light} />
            <TextInput
              style={styles.input}
              placeholder="Receiver Phone"
              placeholderTextColor={Colors.text.light}
              keyboardType="phone-pad"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
            />
          </View>
          <View style={[styles.inputWrap, { alignItems: 'flex-start', minHeight: 80 }]}>
            <MaterialIcons name="notes" size={20} color={Colors.text.light} style={{ marginTop: 2 }} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Special instructions (optional)"
              placeholderTextColor={Colors.text.light}
              multiline
              value={instructions}
              onChangeText={setInstructions}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Price Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <Animated.Text style={[styles.price, { transform: [{ scale: priceAnim }] }]}>
            ₹{getPrice()}
          </Animated.Text>
        </View>
        <Button
          title="Book Parcel"
          onPress={() => router.back()}
          style={{ flex: 1, marginLeft: 16 }}
        />
      </View>
    </Animated.View>
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
  locCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 4,
    marginBottom: 20,
    ...Shadow.sm,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  locDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 38,
  },
  locLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
    marginBottom: 2,
  },
  locText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeCard: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  typeCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  weightChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  weightChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  weightText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.secondary,
  },
  inputGroup: {
    gap: 10,
    marginBottom: 20,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text.primary,
    fontWeight: FontWeight.medium,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadow.dark,
  },
  priceLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.light,
    marginBottom: 2,
  },
  price: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.primary,
  },
});
