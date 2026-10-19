import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { authClient } from '@/services/auth';
import { BaseCard, ConfirmationModal } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

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
          infrastruktur sekolah.
        </Text>

        <Text style={[styles.version, { color: theme.textMuted }]}>
          Versi 1.0.0
        </Text>

        <Pressable
          onPress={() => setConfirmVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Keluar dari Akun"
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: theme.dangerSurface,
              borderColor: theme.danger,
            },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.logoutText, { color: theme.danger }]}>
            Keluar dari Akun
          </Text>
        </Pressable>
      </BaseCard>

      <ConfirmationModal
        visible={confirmVisible}
        title="Keluar dari Akun?"
        message="Apakah Anda yakin ingin keluar dari akun ini?"
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        tone="danger"
        loading={loading}
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.md,
  },
  brand: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  version: {
    fontSize: 11,
    marginBottom: spacing.md,
  },
  logoutButton: {
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
