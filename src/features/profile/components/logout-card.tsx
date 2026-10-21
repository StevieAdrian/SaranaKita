import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import logoutLogo from '@/assets/images/logout-logo.png';
import { authClient } from '@/services/auth';
import { BaseCard, ConfirmationModal } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { profileFonts } from '../utils/constants';

export function LogoutCard(): React.JSX.Element {
  const { theme } = useRole();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
    } finally {
      setLoading(false);
      setConfirmVisible(false);
    }
  };

  return (
    <>
      <BaseCard style={styles.card}>
        <Text
          accessibilityRole="header"
          style={[styles.brand, { color: theme.textHeading }]}
        >
          Sarana Kita
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Platform crowdsourcing untuk melaporkan dan memantau permasalahan
          infrastruktur sekolah. Versi 1.0.0
        </Text>

        <TouchableOpacity
          onPress={() => setConfirmVisible(true)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Keluar dari Akun"
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>
            Keluar dari Akun
          </Text>
        </TouchableOpacity>
      </BaseCard>

      <ConfirmationModal
        visible={confirmVisible}
        title="Keluar dari Akun?"
        message="Anda akan keluar dari sesi ini. Pastikan semua perubahan telah disimpan."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        tone="danger"
        iconSource={logoutLogo}
        loading={loading}
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}


const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 32,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  brand: {
    fontFamily: profileFonts.bold,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 23,
    marginBottom: 6,
  },
  description: {
    fontFamily: profileFonts.regular,
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    lineHeight: 20,
    marginBottom: 16,
  },
  logoutButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: profileFonts.semiBold,
    fontSize: 15,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#EF4444',
  },
});
