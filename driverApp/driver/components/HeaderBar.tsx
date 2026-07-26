import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Props {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotification?: boolean;
  showSupport?: boolean;
  showOptions?: boolean;
  onBack?: () => void;
}

export const HeaderBar: React.FC<Props> = ({
  title,
  showBack = false,
  showMenu = false,
  showNotification = false,
  showSupport = false,
  showOptions = false,
  onBack,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity style={styles.iconBtn} onPress={onBack || (() => router.back())}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="menu-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        )}
        {showSupport && (
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="headset-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#FFF" />
            <View style={styles.redDot} />
          </TouchableOpacity>
        )}
        {showOptions && (
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    width: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    padding: 6,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
});
