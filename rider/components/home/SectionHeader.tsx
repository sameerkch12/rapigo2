import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontWeight } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export default function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: FontWeight.extrabold,
  },
  seeAll: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: FontWeight.bold,
  },
});
