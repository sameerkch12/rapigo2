import { Redirect } from 'expo-router';
import { useDriverAuth } from '../contexts/DriverAuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/theme';

export default function Index() {
  const { driver, isLoading } = useDriverAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (driver) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

