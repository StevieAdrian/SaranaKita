import React from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';
import filterIcon from '@/assets/images/filter.png';
import searchIcon from '@/assets/images/search.png';
import { hitSlop } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';

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
  const { theme } = useRole();

  return (
    <View className="flex-row gap-2">
      <View
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.borderInput,
        }}
        className="h-12 flex-1 flex-row items-center rounded-lg border px-4"
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textPlaceholder}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel={placeholder}
          style={{ color: theme.textInput }}
          className="flex-1 text-base"
        />
        <Image
          source={searchIcon}
          resizeMode="contain"
          className="h-5 w-5"
          style={{ tintColor: theme.iconInactive }}
        />
      </View>
      {onFilterPress ? (
        <Pressable
          onPress={onFilterPress}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityLabel={filterActive ? 'Filter, sedang aktif' : 'Filter'}
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.borderInput,
          }}
          className="h-12 w-12 items-center justify-center rounded-lg border active:opacity-70"
        >
          <Image
            source={filterIcon}
            resizeMode="contain"
            className="h-5 w-5"
            style={{ tintColor: theme.iconInactive }}
          />
          {filterActive ? (
            <View
              style={{ backgroundColor: theme.primary }}
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
            />
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}
