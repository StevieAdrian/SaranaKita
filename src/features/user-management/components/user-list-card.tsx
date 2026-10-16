import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dummyAvatar from '@/assets/images/base-pict.png';
import vectorDelete from '@/assets/images/vector-delete.png';
import vectorEdit from '@/assets/images/vector-edit.png';
import type { ManageUser } from '@/services/users';
import { Avatar, BaseCard, ConfirmationModal } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type UserListCardProps = {
  user: ManageUser;
  onEdit: (user: ManageUser) => void;
  onDelete: (userId: string) => Promise<void>;
};

export function UserListCard({
  user,
  onEdit,
  onDelete,
}: UserListCardProps): React.JSX.Element {
  const { theme } = useRole();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = user.status ?? 'active';
  const isInactive = status === 'inactive';
  const isPending = status === 'pending';

  const statusColor = isInactive
    ? theme.danger
    : isPending
      ? '#F59E0B'
      : theme.success;
  const statusBg = isInactive
    ? theme.dangerSurface
    : isPending
      ? '#FEF9C3'
      : theme.successSurface;
  const statusLabel = isInactive
    ? 'Nonaktif'
    : isPending
      ? 'Menunggu'
      : 'Aktif';

  const roleLabel =
    user.role === 'siswa'
      ? 'Siswa'
      : user.role === 'guru'
        ? 'Guru'
        : user.role === 'staff'
          ? 'Staff'
          : 'Admin';

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(user.id);
      setConfirmDeleteVisible(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <BaseCard style={styles.card}>
        {/* User Card */}
        <View style={styles.topRow}>
          <Avatar
            uri={user.avatarUrl}
            source={!user.avatarUrl ? dummyAvatar : undefined}
            name={user.fullName ?? user.username ?? 'User'}
            size="md"
          />

          <View style={styles.infoCol}>
            <View style={styles.nameBadgeRow}>
              <Text
                numberOfLines={1}
                style={[styles.nameText, { color: theme.textHeading }]}
              >
                {user.fullName || user.username || 'Pengguna'}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: theme.backgroundSubtle },
                ]}
              >
                <Text style={[styles.roleText, { color: theme.primary }]}>
                  {roleLabel}
                </Text>
              </View>
            </View>

            <Text
              numberOfLines={1}
              style={[styles.subtitleText, { color: theme.textSecondary }]}
            >
              {user.classOrPosition || user.email}
            </Text>

            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusLabel}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.divider, { backgroundColor: theme.borderSubtle }]}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onEdit(user)}
            accessibilityRole="button"
            accessibilityLabel={`Edit pengguna ${user.fullName || ''}`}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Image
              source={vectorEdit}
              resizeMode="contain"
              style={[styles.actionIcon, { tintColor: theme.textSecondary }]}
            />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>
              Edit
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setConfirmDeleteVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Hapus pengguna ${user.fullName || ''}`}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
          >
            <Image
              source={vectorDelete}
              resizeMode="contain"
              style={[styles.actionIcon, { tintColor: theme.danger }]}
            />
            <Text style={[styles.actionText, { color: theme.danger }]}>
              Hapus
            </Text>
          </Pressable>
        </View>
      </BaseCard>

      <ConfirmationModal
        visible={confirmDeleteVisible}
        title="Hapus Pengguna?"
        message="Konfirmasi untuk menghapus pengguna. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        tone="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoCol: {
    flex: 1,
    gap: 3,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
  },
  subtitleText: {
    fontSize: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.sm,
    marginTop: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionIcon: {
    width: 14,
    height: 14,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
