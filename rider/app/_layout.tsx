import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { RideProvider } from '@/contexts/RideContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RideProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="book-ride" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="location-search" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="live-tracking" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="parcel" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="monthly-pass" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          </Stack>
        </RideProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
