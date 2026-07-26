import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontWeight, Shadow } from '@/constants/theme';
const RECENT_PLACES: any[] = [];

interface RecentPlacesListProps {
  onPlacePress: () => void;
}

export default function RecentPlacesList({ onPlacePress }: RecentPlacesListProps) {
  return (
    <View style={styles.recentList}>
      {RECENT_PLACES.slice(0, 2).map((place) => (
        <TouchableOpacity key={place.id} style={styles.placeRow} activeOpacity={0.8} onPress={onPlacePress}>
          <View style={styles.placeIcon}>
            <MaterialIcons name={place.icon as any} size={18} color={Colors.primary} />
          </View>
          <View style={styles.placeCopy}>
            <Text style={styles.placeLabel}>{place.label}</Text>
            <Text style={styles.placeAddress} numberOfLines={1}>{place.address}</Text>
          </View>
          <MaterialIcons name="star-border" size={18} color="#64748B" />
          <MaterialIcons name="chevron-right" size={20} color="#64748B" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recentList: {
    gap: 8,
  },
  placeRow: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    ...Shadow.sm,
  },
  placeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeCopy: {
    flex: 1,
  },
  placeLabel: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: FontWeight.extrabold,
    marginBottom: 1,
  },
  placeAddress: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: FontWeight.medium,
  },
});
