import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDriverAuth } from '../contexts/DriverAuthContext';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { login, driver, isLoading } = useDriverAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (driver) {
      router.replace('/(tabs)');
    }
  }, [driver]);

  const handleContinue = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroGraphicBox}>
          <Ionicons name="car-sport" size={64} color="#FFF" />
        </View>
        <Text style={styles.welcomeTitle}>RapiGo Captain</Text>
        <Text style={styles.welcomeSub}>Drive & Earn on your schedule</Text>
      </View>

      {/* Bottom Sheet Card */}
      <View style={[styles.bottomCard, Shadows.card]}>
        <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.cardHeader}>Captain Login</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="captain@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.continueBtnText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/register-details')}
          >
            <Text style={styles.registerBtnText}>New Captain? Register Here</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  heroBanner: { height: '38%', alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
  heroGraphicBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  welcomeTitle: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  welcomeSub: { fontSize: 13, color: 'rgba(255, 255, 255, 0.85)', marginTop: 4 },
  bottomCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formScroll: { paddingBottom: 24 },
  cardHeader: { fontSize: 20, fontWeight: '800', color: Colors.textDark, marginBottom: 16 },
  errorBox: { backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginBottom: 12 },
  errorText: { color: '#DC2626', fontSize: 13 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: Colors.textDark, marginBottom: 6 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: 14,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, color: Colors.textDark },
  continueBtn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  registerBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 10 },
  registerBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
