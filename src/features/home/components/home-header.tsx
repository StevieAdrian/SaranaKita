import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import notificationIcon from '@/assets/images/notification.png';
import { hitSlop } from '@/shared/theme';

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
  const badge = unreadNotifications > 99 ? '99+' : String(unreadNotifications);

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
     
      <Pressable
        onPress={onNotificationsPress}
        disabled={!onNotificationsPress}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={
          unreadNotifications > 0
            ? `Notifikasi, ${unreadNotifications} belum dibaca`
            : 'Notifikasi'
        }
        className="h-11 w-11 items-center justify-center rounded-full bg-white/20 active:opacity-70"
      >
        <Image
          source={notificationIcon}
          resizeMode="contain"
          className="h-6 w-6"
        />
        {unreadNotifications > 0 ? (
          <View className="absolute -right-1 -top-1 min-w-[20px] items-center rounded-full bg-red-500 px-1">
            <Text className="text-xs font-bold text-white">{badge}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
