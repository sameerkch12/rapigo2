import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontWeight, Shadow } from '@/constants/theme';

interface RidePassBannerProps {
  onPress: () => void;
}

export default function RidePassBanner({ onPress }: RidePassBannerProps) {
  return (
    <>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={['#243EEA', '#1238C8', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.passBanner}
        >
          <View style={styles.passLeft}>
            <View style={styles.passHeadingRow}>
              <Text style={styles.passTitle}>Monthly Ride Pass</Text>
              <View style={styles.crownCircle}>
                <MaterialIcons name="workspace-premium" size={11} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.passSubtitle}>Unlimited rides at</Text>
            <View style={styles.priceRow}>
              <Text style={styles.passPrice}>₹999</Text>
              <Text style={styles.passPeriod}>/month</Text>
            </View>
          </View>

          <View style={styles.passRight}>
            <View style={styles.passButton}>
              <Text style={styles.passButtonText}>Get Pass</Text>
              <View style={styles.passArrow}>
                <MaterialIcons name="arrow-forward" size={14} color={Colors.white} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.sliderDots}>
        <View style={styles.dotMuted} />
        <View style={styles.dotActive} />
        <View style={styles.dotMuted} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  passBanner: {
    minHeight: 110,
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.sm,
  },
  passLeft: {
    flex: 1,
  },
  passHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  passTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: FontWeight.extrabold,
  },
  crownCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passSubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12,
    fontWeight: FontWeight.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  passPrice: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: FontWeight.extrabold,
  },
  passPeriod: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    marginLeft: 4,
  },
  passRight: {
    alignItems: 'flex-end',
  },
  passButton: {
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 5,
    gap: 8,
  },
  passButtonText: {
    color: '#172554',
    fontSize: 13,
    fontWeight: FontWeight.extrabold,
  },
  passArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  dotMuted: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DCE6F5',
  },
  dotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
