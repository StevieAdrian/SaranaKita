import React from 'react';
import type { UserRole } from '@/services/auth';
import { getThemeColors, palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';
import { Text, View } from 'react-native';
import notificationIcon from '@/assets/images/notification.png';
import { NotificationButton } from '@/shared/components/ui/notification';

type StatisticHeaderProps = {
  role: UserRole;
  completed: number;
  total: number;
  waitingVerification: number;
  inInspection: number;
  inRepair: number;
  onNotificationPress?: () => void;
  unreadNotifications?: number;
};
export function StatisticHeader({
  role,
  completed,
  total,
  waitingVerification,
  inInspection,
  inRepair,
  onNotificationPress,
  unreadNotifications,
}: StatisticHeaderProps): React.JSX.Element {
  const { theme } = useRole();
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const getTheme = getThemeColors(role);
  const getColor = palette;
  const statistics = [
    {
      value: waitingVerification,
      label: 'Menunggu\nVerifikasi',
      color: getColor.primary,
    },
    {
      value: inInspection,
      label: 'Dalam\nPemeriksaan',
      color: getColor.warning,
    },
    {
      value: inRepair,
      label: 'Dalam\nPerbaikan',
      color: getColor.brown,
    },
    {
      value: completed,
      label: 'Laporan\nSelesai',
      color: getColor.greenStatus,
    },
  ];

  return (
    <View
      className="gap-5 px-5 pb-5 pt-20"
      style={{ backgroundColor: getTheme.primary }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-2xl font-bold"
          style={{ color: getTheme.onPrimary }}
        >
          Monitor Laporan
        </Text>

        <NotificationButton
          notificationIcon={notificationIcon}
          unreadNotifications={unreadNotifications}
          onNotificationsPress={onNotificationPress}
        />
      </View>

      <View
        className="rounded-[8px] p-5"
        style={{
          backgroundColor: `${getTheme.primaryStrong}60`,
        }}
      >
        <View className="flex-row items-center gap-5">
          <View className="h-24 w-24 items-center justify-center rounded-full border-[5px] border-white">
            <Text className="text-2xl font-bold text-white">{percentage}%</Text>
            <Text className="text-xs text-white">Selesai</Text>
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-[20px] font-medium text-white">
              Tingkat Penyelesaian
            </Text>

            <Text className="text-[10px] text-xs font-medium text-white">
              {completed} dari {total} laporan diselesaikan
            </Text>

            <View className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
              <View
                className="h-full rounded-full bg-white"
                style={{ width: `${percentage}%` }}
              />
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2">
        {statistics.map(item => (
          <View
            key={item.label}
            style={{ backgroundColor: theme.surface }} className="min-h-[70px] flex-1 items-center justify-center rounded-md px-1 py-2"
          >
            <Text
              className="text-xl font-semibold"
              style={{ color: item.color }}
            >
              {item.value}
            </Text>

            <Text
              className="text-center text-[10px]"
              style={{ color: item.color }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
