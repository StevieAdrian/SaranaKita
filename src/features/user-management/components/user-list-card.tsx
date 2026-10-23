import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ManageUser } from '@/services/users';
import { ConfirmationModal } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { userFonts } from '../utils/constants';
import iconDelete from '@/assets/images/icon-trash.png';
import iconEdit from '@/assets/images/vector-edit.png';

export type UserListCardProps = {
  user: ManageUser;
  onEdit: (user: ManageUser) => void;
  onDelete: (userId: string) => Promise<void>;
};

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || 'U';
  }
  return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
}

import { formatClassOrPosition } from '../utils/format';
export { formatClassOrPosition };

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

  const statusLabel = isInactive
    ? 'Nonaktif'
    : isPending
      ? 'Tertunda'
      : 'Aktif';

  const statusBg = isInactive
    ? '#FEE2E2'
    : isPending
      ? '#FEF3C7'
      : '#DCFCE7';

  const statusColor = isInactive
    ? '#DC2626'
    : isPending
      ? '#D97706'
      : '#16A34A';

  const role = user.role ?? 'siswa';
  const roleLabel =
    role === 'siswa'
      ? 'Siswa'
      : role === 'guru'
        ? 'Guru'
        : role === 'staff'
          ? 'Staff'
          : 'Admin';

  const roleBadgeStyle = (() => {
    switch (role) {
      case 'siswa':
        return { bg: '#DBEAFE', text: '#112D71' };
      case 'guru':
        return { bg: '#FEF9C3', text: '#F59E0B' };
      case 'staff':
        return { bg: '#DCFCE7', text: '#166534' };
      default:
        return { bg: '#FEE2E2', text: theme.primary };
    }
  })();

  const avatarBgColor = (() => {
    switch (role) {
      case 'siswa':
        return theme.primary === '#360707' ? '#360707' : '#112D71';
      case 'guru':
        return '#F59E0B';
      case 'staff':
        return '#166534';
      default:
        return theme.primary;
    }
  })();

  const handleConfirmDelete = async () => {
    if (user.role === 'administrator') {
      setConfirmDeleteVisible(false);
      return;
    }
    setDeleting(true);
    try {
      await onDelete(user.id);
      setConfirmDeleteVisible(false);
    } finally {
      setDeleting(false);
    }
  };

  const displayName = user.fullName || user.username || 'Pengguna';
  const classOrPos = formatClassOrPosition(user.role, user.classOrPosition);

  return (
    <>
      <View style={styles.card}>
        {/* Profile Image */}
        <View style={styles.topSection}>
          {user.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: avatarBgColor },
              ]}
            >
              <Text style={styles.avatarInitials}>
                {getInitials(displayName)}
              </Text>
            </View>
          )}

          <View style={styles.infoCol}>
            {/* Nama & Role */}
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={styles.nameText}>
                {displayName}
              </Text>
              <View
                style={[
                  styles.pillBadge,
                  { backgroundColor: roleBadgeStyle.bg },
                ]}
              >
                <Text
                  style={[
                    styles.pillBadgeText,
                    { color: roleBadgeStyle.text },
                  ]}
                >
                  {roleLabel}
                </Text>
              </View>
            </View>

            {/* Email */}
            <Text numberOfLines={1} style={styles.emailText}>
              {user.email}
            </Text>

            {/* Class & Status */}
            <View style={styles.classStatusRow}>
              <Text numberOfLines={1} style={styles.classText}>
                {classOrPos}
              </Text>
              <View
                style={[
                  styles.pillBadge,
                  { backgroundColor: statusBg },
                ]}
              >
                <Text
                  style={[
                    styles.pillBadgeText,
                    { color: statusColor },
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <View style={styles.actionHalf}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onEdit(user)}
              accessibilityRole="button"
              accessibilityLabel={`Edit pengguna ${displayName}`}
              style={styles.actionButton}
            >
              <Image
                source={iconEdit}
                resizeMode="contain"
                style={[styles.actionIcon, styles.editIcon]}
              />
              <Text numberOfLines={1} style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.actionHalf}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setConfirmDeleteVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`Hapus pengguna ${displayName}`}
              style={styles.actionButton}
            >
              <Image
                source={iconDelete}
                resizeMode="contain"
                style={[styles.actionIcon, styles.deleteIcon]}
              />
              <Text numberOfLines={1} style={styles.deleteText}>
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ConfirmationModal
        visible={confirmDeleteVisible}
        title="Hapus Pengguna?"
        message="Konfirmasi Aksi untuk menghapus pengguna"
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
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 0.8,
    borderColor: '#F3F4F6',
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: userFonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontFamily: userFonts.semiBold,
    fontSize: 14,
    color: '#101828',
    flexShrink: 1,
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pillBadgeText: {
    fontFamily: userFonts.semiBold,
    fontSize: 10,
  },
  emailText: {
    fontFamily: userFonts.regular,
    fontSize: 11,
    color: '#99A1AF',
  },
  classStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  classText: {
    fontFamily: userFonts.medium,
    fontSize: 11,
    color: '#4A5565',
    flexShrink: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.8,
    borderTopColor: '#F3F4F6',
    height: 38,
    width: '100%',
  },
  actionHalf: {
    flex: 1,
    height: 38,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  actionIcon: {
    width: 15,
    height: 15,
    marginRight: 6,
  },
  editIcon: {
    tintColor: '#1E1E1E',
  },
  deleteIcon: {
    tintColor: '#9A3412',
  },
  editText: {
    fontFamily: userFonts.semiBold,
    fontSize: 12,
    color: '#1E1E1E',
  },
  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#F3F4F6',
  },
  deleteText: {
    fontFamily: userFonts.semiBold,
    fontSize: 12,
    color: '#9A3412',
  },
  pressed: {
    opacity: 0.65,
  },
});
