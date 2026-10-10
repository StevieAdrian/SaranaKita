import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import leftArrow from '@/assets/images/left-arrow.png';
import { hitSlop } from '@/shared/theme';

export type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: ScreenHeaderProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-primary px-5 pb-8" style={{ paddingTop: insets.top + 24 }}>
      <View className="min-h-[44px] flex-row items-center justify-center">
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            className="absolute left-0 h-11 w-11 justify-center active:opacity-60"
          >
            <Image source={leftArrow} resizeMode="contain" className="h-6 w-6" />
          </Pressable>
        ) : null}
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="px-12 text-center text-2xl font-bold text-white"
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
