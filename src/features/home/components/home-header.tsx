import React from 'react';
import { Text, View } from 'react-native';
import notificationIcon from '@/assets/images/notification.png';
import { NotificationButton } from '@/shared/components/ui/notification';

export type HomeHeaderProps = {
  name: string;
  schoolName: string | null;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
};

export function HomeHeader({
  name,
  schoolName,
  unreadNotifications = 0,
  onNotificationsPress,
}: HomeHeaderProps): React.JSX.Element {
  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1 gap-0.5 pr-4">
        <Text className="text-sm text-white/80">Selamat datang,</Text>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="text-2xl font-bold text-white"
        >
          {name} 👋
        </Text>
        {schoolName ? (
          <Text numberOfLines={1} className="text-sm text-white/80">
            {schoolName}
          </Text>
        ) : null}
      </View>

      <NotificationButton
        notificationIcon={notificationIcon}
        unreadNotifications={unreadNotifications}
        onNotificationsPress={onNotificationsPress}
      />
    </View>
  );
}
