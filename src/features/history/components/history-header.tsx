import React from 'react';
import { USER_ROLE, type UserRole } from '@/services/auth';
import { getThemeColors } from '@/shared/theme';
import { Text, View } from 'react-native';
import notificationIcon from '@/assets/images/notification.png';
import { NotificationButton } from '@/shared/components/ui/notification';
import {
  type ChipTabOption,
  ChipTabs,
  SearchBar,
} from '@/shared/components/ui';
import { HistoryFilter } from '..';

type HistoryHeaderProps = {
  role: UserRole;
  onNotificationPress?: () => void;
  unreadNotifications?: number;
  filterTab: HistoryFilter;
  onFilterChange: (filter: HistoryFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export function HistoryHeader({
  role,
  onNotificationPress,
  unreadNotifications,
  filterTab,
  onFilterChange,
  query,
  onQueryChange,
}: HistoryHeaderProps): React.JSX.Element {
  const theme = getThemeColors(role);
  const tabTone =
    role === USER_ROLE.GURU
      ? 'teacher'
      : role === USER_ROLE.STAFF
        ? 'staff'
        : role === USER_ROLE.ADMINISTRATOR
          ? 'admin'
          : 'primary';

  const reportFilterOptions: readonly ChipTabOption<HistoryFilter>[] =
    role === USER_ROLE.SISWA
      ? [
        { value: 'all', label: 'Semua' },
        { value: 'mine', label: 'Laporan Saya' },
        { value: 'supported', label: 'Didukung' },
      ]
      : role === USER_ROLE.GURU
        ? [
          { value: 'all', label: 'Semua' },
          { value: 'mine', label: 'Laporan Saya' },
          { value: 'recommended', label: 'Direkomendasi' },
        ]
        : role === USER_ROLE.STAFF
          ? [
            { value: 'all', label: 'Semua' },
            { value: 'mine', label: 'Laporan Saya' },
          ]
          : [];

  return (
    <View
      className="w-full gap-5 px-5 pb-5 pt-20"
      style={{ backgroundColor: theme.primary }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold" style={{ color: theme.onPrimary }}>
          Riwayat Laporan
        </Text>

        <NotificationButton
          notificationIcon={notificationIcon}
          unreadNotifications={unreadNotifications}
          onNotificationsPress={onNotificationPress}
        />
      </View>

      <SearchBar
        value={query}
        onChangeText={onQueryChange}
        placeholder="Cari Laporan"
        filterActive={false}
      />

      {reportFilterOptions.length > 0 && (
        <ChipTabs
          options={reportFilterOptions}
          value={filterTab}
          onChange={onFilterChange}
          accessibilityLabel="Filter laporan"
          tone={tabTone}
        />
      )}
    </View>
  );
}
