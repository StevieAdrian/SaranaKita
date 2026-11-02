import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ManageUser } from '@/services/users';
import { toUserMessage } from '@/services/api';
import { Toast } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { hitSlop } from '@/shared/theme';
import { FilterStatus } from '../components/filter-status';
import { HeaderUserManagement } from '../components/header-user-management';
import { UserListCard } from '../components/user-list-card';
import { useUserManagement } from '../hooks/use-user-management';
import { userFonts } from '../utils/constants';
import { isRoleAdminOrStaff } from '../utils/permissions';

export function UserManagementScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<any>();
  const { theme, currentRole } = useRole();

  React.useEffect(() => {
    if (!isRoleAdminOrStaff(currentRole)) {
      navigation.goBack();
    }
  }, [currentRole, navigation]);

  const {
    users,
    allUsers,
    totalCount,
    summary,
    schoolName,
    loading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    reload,
    deleteUser,
  } = useUserManagement();

  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  useFocusEffect(
    useCallback(() => {
      reload();
      if (route.params?.toastMessage) {
        setToast({
          visible: true,
          message: route.params.toastMessage,
          type: route.params.toastType || 'success',
        });
        navigation.setParams({ toastMessage: undefined, toastType: undefined });
      }
    }, [reload, route.params, navigation]),
  );

  const handleAddUser = () => {
    navigation.navigate('AddUser');
  };

  const handleEditUser = (user: ManageUser) => {
    navigation.navigate('EditUser', { user });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setToast({
        visible: true,
        message: 'Pengguna berhasil dihapus.',
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        visible: true,
        message:
          toUserMessage(err) ||
          err?.message ||
          'Gagal menghapus pengguna.',
        type: 'error',
      });
    }
  };

  const metrics = useMemo(() => {
    const calc = (role: string, totalFromSummary: number) => {
      const roleUsers = (allUsers ?? []).filter((u) => u.role === role);
      if (roleUsers.length === 0) {
        return { total: totalFromSummary, active: totalFromSummary, inactive: 0 };
      }
      const inactive = roleUsers.filter((u) => u.status === 'inactive').length;
      const active = roleUsers.length - inactive;
      return { total: totalFromSummary || roleUsers.length, active, inactive };
    };

    return {
      siswa: calc('siswa', summary.totalSiswa),
      guru: calc('guru', summary.totalGuru),
      staff: calc('staff', summary.totalStaff),
    };
  }, [allUsers, summary]);

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* Header, Filter, Search */}
      <HeaderUserManagement
        totalUsers={totalCount}
        schoolName={schoolName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPressFilter={() => setFilterSheetVisible(true)}
        activeFilterCount={statusFilter !== 'all' ? 1 : 0}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        summary={metrics}
      />

      {/* User List */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={reload}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.listTitleRow}>
            {/* Jumlah Pengguna */}
            <Text accessibilityRole="header" style={[styles.countHeader, { color: theme.textHeading }]}>
              {users.length} Pengguna
            </Text>

            {/* Tambah Pengguna */}
            <Pressable
              onPress={handleAddUser}
              hitSlop={hitSlop}
              accessibilityRole="button"
              accessibilityLabel="Tambah pengguna baru"
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.addText, { color: theme.primary }]}>
                Tambah +
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <UserListCard
            user={item}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Tidak ada pengguna yang ditemukan.
            </Text>
          </View>
        }
      />

      {/* PopUp */}
      <FilterStatus
        visible={filterSheetVisible}
        selectedStatus={statusFilter}
        onApply={setStatusFilter}
        onClose={() => setFilterSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF3FD',
  },
  listContent: {
    paddingBottom: 48,
  },
  listTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  countHeader: {
    fontFamily: userFonts.semiBold,
    fontSize: 16,
    color: '#0F172A',
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  addText: {
    fontFamily: userFonts.medium,
    fontSize: 12,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: userFonts.regular,
    fontSize: 14,
    color: '#64748B',
  },
  pressed: {
    opacity: 0.6,
  },
});
