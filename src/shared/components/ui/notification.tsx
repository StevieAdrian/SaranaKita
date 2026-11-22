import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useNotifications } from '@/shared/context/notifications-context';

type NotificationButtonProps = {
  notificationIcon: ImageSourcePropType;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  hitSlop?: number;
};

export function NotificationButton({
  notificationIcon,
  unreadNotifications,
  onNotificationsPress,
  hitSlop = 8,
}: NotificationButtonProps): React.JSX.Element {
  const { unreadCount } = useNotifications();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const count = unreadNotifications ?? unreadCount;
  const onPress =
    onNotificationsPress ?? (() => navigation.navigate('Notifications'));
  const badge = count > 99 ? '99+' : String(count);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={
        count > 0 ? `Notifikasi, ${count} belum dibaca` : 'Notifikasi'
      }
      className="h-11 w-11 items-center justify-center rounded-full bg-white/20 active:opacity-70"
    >
      <Image
        source={notificationIcon}
        resizeMode="contain"
        className="h-6 w-6"
      />

      {count > 0 ? (
        <View className="absolute -right-1 -top-1 min-w-[20px] items-center rounded-full bg-red-500 px-1">
          <Text className="text-xs font-bold text-white">{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
