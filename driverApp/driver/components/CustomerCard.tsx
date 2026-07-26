import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: string;
  phone?: string;
  onCall?: () => void;
}

export const CustomerCard: React.FC<Props> = ({ name, phone = '+91 9876543210', onCall }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={20} color={Colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.callBtn} onPress={onCall}>
        <Ionicons name="call" size={18} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 10,
    marginTop: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textDark,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
