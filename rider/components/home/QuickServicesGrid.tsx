import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { HOME_SERVICES, HomeServiceId } from '@/constants/home';
import { Colors, FontWeight, Shadow } from '@/constants/theme';

interface QuickServicesGridProps {
  onServicePress: (serviceId: HomeServiceId) => void;
}

export default function QuickServicesGrid({ onServicePress }: QuickServicesGridProps) {
  return (
    <View style={styles.servicesRow}>
      {HOME_SERVICES.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={styles.serviceCard}
          activeOpacity={0.85}
          onPress={() => onServicePress(service.id)}
        >
          <LinearGradient colors={['#EEF2FF', '#F8FAFC']} style={styles.serviceIconStage}>
            <MaterialIcons name={service.icon} size={24} color={Colors.primary} />
          </LinearGradient>
          <Text style={styles.serviceLabel}>{service.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  servicesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  serviceCard: {
    flex: 1,
    height: 76,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadow.sm,
  },
  serviceIconStage: {
    width: 42,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  serviceLabel: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: FontWeight.extrabold,
  },
});
