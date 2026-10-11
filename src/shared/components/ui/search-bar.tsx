import React from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';
import filterIcon from '@/assets/images/filter.png';
import searchIcon from '@/assets/images/search.png';
import { hitSlop, palette } from '@/shared/theme';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Cari',
  onFilterPress,
  filterActive = false,
}: SearchBarProps): React.JSX.Element {
  return (
    <View className="flex-row gap-2">
      <View className="h-12 flex-1 flex-row items-center rounded-lg border border-field-border bg-white px-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.gray500}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel={placeholder}
          className="flex-1 text-base text-gray-900"
        />
        <Image source={searchIcon} resizeMode="contain" className="h-5 w-5" />
      </View>
      {onFilterPress ? (
        <Pressable
          onPress={onFilterPress}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityLabel={filterActive ? 'Filter, sedang aktif' : 'Filter'}
          className="h-12 w-12 items-center justify-center rounded-lg border border-field-border bg-white active:opacity-70"
        >
          <Image source={filterIcon} resizeMode="contain" className="h-5 w-5" />
          {filterActive ? (
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}
