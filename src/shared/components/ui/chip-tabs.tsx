import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

export type ChipTabOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

export type ChipTabsProps<T extends string> = {
  options: readonly ChipTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

const CONTENT_STYLE = { gap: 8 } as const;

export function ChipTabs<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
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
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={`min-h-[44px] min-w-[96px] items-center justify-center rounded-md border px-4 active:opacity-70 ${
              selected
                ? 'border-primary bg-[#DBEAFE]'
                : 'border-gray-300 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${
                selected ? 'font-semibold text-primary' : 'text-gray-500'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
