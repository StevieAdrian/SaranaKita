import React from 'react';
import { Pressable, ScrollView, Text, type ViewStyle } from 'react-native';
import { palette } from '@/shared/theme';

export type ChipTabOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

export type ChipTabsProps<T extends string> = {
  options: readonly ChipTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  tone?: 'primary' | 'teacher';
};

const CONTENT_STYLE = { flexGrow: 1, flexDirection: 'row', gap: 8 } as const;

export function ChipTabs<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  tone = 'primary',
}: ChipTabsProps<T>): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={CONTENT_STYLE}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map(option => {
        const selected = option.value === value;
        const activeColor =
          tone === 'teacher' ? palette.teacherPrimary : palette.primary;
        const activeBackground =
          tone === 'teacher' ? palette.teacherSoft : palette.infoBackground;
        const activeStyle: ViewStyle | undefined = selected
          ? { borderColor: activeColor, backgroundColor: activeBackground }
          : undefined;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={activeStyle}
            className={`min-h-[44px] min-w-[96px] items-center justify-center rounded-md border px-4 active:opacity-70 ${
              selected
                ? 'border-primary bg-[#DBEAFE]'
                : 'border-gray-300 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${
                selected ? 'font-semibold' : 'text-gray-500'
              }`}
              style={selected ? { color: activeColor } : undefined}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
