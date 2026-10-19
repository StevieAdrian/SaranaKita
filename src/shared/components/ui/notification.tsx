import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';

type NotificationButtonProps = {
  notificationIcon: ImageSourcePropType;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  hitSlop?: number;
};

export function NotificationButton({
  notificationIcon,
  unreadNotifications = 0,
  onNotificationsPress,
  hitSlop = 8,
}: NotificationButtonProps): React.JSX.Element {
  const badge = unreadNotifications > 99 ? '99+' : String(unreadNotifications);

  return (
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
  );
}
