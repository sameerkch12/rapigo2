import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DriverAuthProvider } from '../contexts/DriverAuthContext';
import { DriverRideProvider } from '../contexts/DriverRideContext';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <DriverAuthProvider>
      <DriverRideProvider>
        <StatusBar style="light" backgroundColor={Colors.primary} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="register-details" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="ride-accepted" />
          <Stack.Screen name="at-pickup" />
          <Stack.Screen name="in-ride" />
          <Stack.Screen name="ride-completed" />
        </Stack>
      </DriverRideProvider>
    </DriverAuthProvider>
  );
}
