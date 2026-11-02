import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { hitSlop } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';

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
  const { theme } = useRole();

  return (
    <View className="flex-row items-center justify-between">
      <Text
        accessibilityRole="header"
        style={{ color: theme.textHeading }}
        className="text-xl font-bold"
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
          <Text style={{ color: theme.textHeading }} className="text-sm font-medium">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
