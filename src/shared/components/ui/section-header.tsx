import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { hitSlop } from '@/shared/theme';

export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  actionLabel = 'Lihat Semua',
  onActionPress,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-between">
      <Text
        accessibilityRole="header"
        className="text-xl font-bold text-gray-900"
      >
        {title}
      </Text>
      {onActionPress ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={hitSlop}
          accessibilityRole="link"
          accessibilityLabel={`${actionLabel} ${title}`}
          className="min-h-[44px] justify-center active:opacity-60"
        >
          <Text className="text-sm font-medium text-gray-900">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
