import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
}

export const OtpModal: React.FC<Props> = ({ visible, onClose, onVerify }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (otp.trim().length !== 4) {
      setError('Please enter valid 4-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onVerify(otp.trim());
      setOtp('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, Shadows.medium]}>
          <View style={styles.header}>
            <Text style={styles.title}>ENTER CUSTOMER OTP</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle-outline" size={26} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Ask customer for the 4-digit start OTP code</Text>

          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              if (error) setError('');
            }}
            placeholder="e.g. 1234"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>START TRIP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
});
