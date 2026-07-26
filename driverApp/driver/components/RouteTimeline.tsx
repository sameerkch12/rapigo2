import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  pickupAddress: string;
  dropAddress: string;
  pickupDistance?: string;
  totalDistance?: string;
}

export const RouteTimeline: React.FC<Props> = ({
  pickupAddress,
  dropAddress,
  pickupDistance,
  totalDistance,
}) => {
  return (
    <View style={styles.container}>
      {/* Pickup Node */}
      <View style={styles.nodeRow}>
        <View style={styles.iconWrapper}>
          <Ionicons name="location" size={16} color={Colors.accentGreen} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.tagLabelGreen}>Pickup</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {pickupAddress}
          </Text>
        </View>
        {pickupDistance ? (
          <View style={styles.distanceBadgeGreen}>
            <Text style={styles.distanceTextGreen}>{pickupDistance}</Text>
            <Text style={styles.subTextGreen}>to pickup</Text>
          </View>
        ) : null}
      </View>

      {/* Connecting Line */}
      <View style={styles.lineRow}>
        <View style={styles.verticalLine} />
      </View>

      {/* Drop Node */}
      <View style={styles.nodeRow}>
        <View style={styles.iconWrapper}>
          <Ionicons name="location" size={16} color={Colors.danger} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.tagLabelRed}>Drop</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {dropAddress}
          </Text>
        </View>
        {totalDistance ? (
          <View style={styles.distanceBadgeRed}>
            <Text style={styles.distanceTextRed}>{totalDistance}</Text>
            <Text style={styles.subTextRed}>Total Ride</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  tagLabelGreen: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentGreen,
    textTransform: 'uppercase',
  },
  tagLabelRed: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.danger,
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 1,
  },
  distanceBadgeGreen: {
    backgroundColor: Colors.accentGreenLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  distanceTextGreen: {
    color: Colors.accentGreen,
    fontWeight: '800',
    fontSize: 11,
  },
  subTextGreen: {
    color: Colors.accentGreen,
    fontSize: 8,
    fontWeight: '600',
  },
  distanceBadgeRed: {
    backgroundColor: Colors.dangerLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  distanceTextRed: {
    color: Colors.danger,
    fontWeight: '800',
    fontSize: 11,
  },
  subTextRed: {
    color: Colors.danger,
    fontSize: 8,
    fontWeight: '600',
  },
  lineRow: {
    paddingLeft: 11,
    height: 18,
    justifyContent: 'center',
  },
  verticalLine: {
    width: 2,
    height: 18,
    backgroundColor: Colors.surfaceBorder,
  },
});
