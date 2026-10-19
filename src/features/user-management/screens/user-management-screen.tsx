import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ManageUser } from '@/services/users';
import { ChipTabs } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';
import { FilterStatus } from '../components/filter-status';
import { HeaderUserManagement } from '../components/header-user-management';
import { SummaryCard } from '../components/summary-card';
import { UserListCard } from '../components/user-list-card';
import { useUserManagement } from '../hooks/use-user-management';
import { ROLE_FILTER_CHIPS } from '../utils/constants';

export function UserManagementScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useRole();

  const {
    users,
    totalCount,
    summary,
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

  const handleAddUser = () => {
    navigation.navigate('AddUser');
  };

  const handleEditUser = (user: ManageUser) => {
    navigation.navigate('EditUser', { user });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header & Filter & Search */}
      <HeaderUserManagement
        totalUsers={totalCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPressFilter={() => setFilterSheetVisible(true)}
        activeFilterCount={statusFilter !== 'all' ? 1 : 0}
      />

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
          <View style={styles.headerComponent}>
            {/* Summary Statistik Card */}
            <SummaryCard
              siswa={{
                total: summary.totalSiswa,
                active: summary.totalSiswa,
                inactive: 0,
              }}
              guru={{
                total: summary.totalGuru,
                active: summary.totalGuru,
                inactive: 0,
              }}
              staff={{
                total: summary.totalStaff,
                active: summary.totalStaff,
                inactive: 0,
              }}
            />

            {/* Role Filter */}
            <View style={styles.chipTabsContainer}>
              <ChipTabs
                options={ROLE_FILTER_CHIPS}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val as any)}
              />
            </View>

            {/* Jumlah Pengguna */}
            <View style={styles.listTitleRow}>
              <Text
                accessibilityRole="header"
                style={[styles.countHeader, { color: theme.textHeading }]}
              >
                {users.length} Pengguna
              </Text>

              {/* Tambah Pengguna */}
              <Pressable
                onPress={handleAddUser}
                accessibilityRole="button"
                accessibilityLabel="Tambah pengguna baru"
                style={({ pressed }) => [
                  styles.addButton,
                  { backgroundColor: theme.primary },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.addText, { color: theme.onPrimary }]}>
                  Tambah +
                </Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <UserListCard
              user={item}
              onEdit={handleEditUser}
              onDelete={deleteUser}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Tidak ada pengguna yang ditemukan.
            </Text>
          </View>
        }
      />

      {/* Popup */}
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
  },
  listContent: {
    paddingBottom: spacing.xl * 2,
  },
  headerComponent: {
    marginBottom: spacing.xs,
  },
  chipTabsContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  listTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  countHeader: {
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  addText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardWrapper: {
    paddingHorizontal: spacing.md,
  },
  emptyContainer: {
    paddingVertical: spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
});
