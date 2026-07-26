import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontWeight, Shadow } from '@/constants/theme';

interface HomeHeaderProps {
  firstName: string;
  greeting: string;
  walletBalance: number;
  onWalletPress: () => void;
}

export default function HomeHeader({ firstName, greeting, walletBalance, onWalletPress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.userName}>{firstName} <Text style={styles.wave}>👋</Text></Text>
      </View>

      <View style={styles.headerActions}>
        <Pressable style={styles.walletPill} onPress={onWalletPress}>
          <MaterialIcons name="account-balance-wallet" size={16} color={Colors.white} />
          <Text style={styles.walletText}>₹{walletBalance.toFixed(0)}</Text>
        </Pressable>
        <Pressable style={styles.notificationButton}>
          <MaterialIcons name="notifications-none" size={20} color={Colors.primaryDark} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 12,
  },
  greetingBlock: {
    flex: 1,
  },
  greeting: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: FontWeight.medium,
    marginBottom: 2,
  },
  userName: {
    color: '#0F1D59',
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
    lineHeight: 24,
  },
  wave: {
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletPill: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadow.sm,
  },
  walletText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: FontWeight.bold,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
});
