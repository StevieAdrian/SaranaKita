import React, { useState } from 'react';
import { USER_ROLE, UserRole } from '@/services/auth';
import { getThemeColors, palette } from '@/shared/theme';
import { Pressable, Text, View } from 'react-native';
import notificationIcon from '@/assets/images/notification.png';
import { NotificationButton } from '@/shared/components/ui/notification';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { useHomeFeed } from '@/features/home/hooks/use-home-feed';
import { ChipTabOption, ChipTabs, SearchBar } from '@/shared/components/ui';

type HistoryHeaderProps = {
  role: UserRole;
  completed: number;
  total: number;
  onNotificationPress?: () => void;
  unreadNotifications?: number;
};
export function HistoryHeader({
  role,
  onNotificationPress,
  unreadNotifications,
}: HistoryHeaderProps): React.JSX.Element {
  const getTheme = getThemeColors(role);
  const getColor = palette;
  const feed = useHomeFeed();
  const [filterTab, setFilterTab] = useState<ReportFilter>('all');
  const [filter, setFilter] = useState(false);
  type ReportFilter = 'all' | 'mine' | 'supported';

  const REPORT_FILTER_OPTIONS: readonly ChipTabOption<ReportFilter>[] = [
    { value: 'all', label: 'Semua' },
    { value: 'mine', label: 'Laporan Saya' },
    { value: 'supported', label: 'Didukung' },
  ];

  return (
    <View
      className="w-full gap-5 px-5 pb-5 pt-20"
      style={{ backgroundColor: getTheme.primary }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-2xl font-bold"
          style={{ color: getTheme.onPrimary }}
        >
          Riwayat Laporan
        </Text>

        <NotificationButton
          notificationIcon={notificationIcon}
          unreadNotifications={unreadNotifications}
          onNotificationsPress={onNotificationPress}
        />
      </View>

      <SearchBar
        value={feed.query}
        onChangeText={feed.setQuery}
        placeholder="Cari Laporan"
        onFilterPress={() => setFilter(true)}
        filterActive={feed.filterActive}
      />
      <ChipTabs
        options={REPORT_FILTER_OPTIONS}
        value={filterTab}
        onChange={setFilterTab}
        accessibilityLabel="Filter laporan"
      />
    </View>
  );
}
