import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';

export type RadioOption<T extends string = string> = {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
  readonly dotColor?: string;
};

export type RadioGroupProps<T extends string = string> = {
  options: readonly RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  direction?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function RadioGroup<T extends string = string>({
  options,
  value,
  onChange,
  direction = 'vertical',
  style,
  itemStyle,
  disabled = false,
}: RadioGroupProps<T>): React.JSX.Element {
  const { theme } = useRole();
  const isHorizontal = direction === 'horizontal';

  return (
    <View
      accessibilityRole="radiogroup"
      style={[
        isHorizontal ? styles.horizontalContainer : styles.verticalContainer,
        style,
      ]}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const isLast = index === options.length - 1;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={option.label}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [
              pressed && !disabled && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.optionRow,
                isHorizontal && !isLast && styles.horizontalItemSpacing,
                itemStyle,
              ]}
            >
              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor: selected ? theme.primary : '#B1A6A6',
                  },
                ]}
              >
                {selected ? (
                  <View
                    style={[styles.radioInner, { backgroundColor: theme.primary }]}
                  />
                ) : null}
              </View>

              {option.dotColor ? (
                <View
                  style={[styles.dotBadge, { backgroundColor: option.dotColor }]}
                />
              ) : null}

              <View style={styles.textContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    selected ? styles.selectedLabel : styles.unselectedLabel,
                    { color: selected ? '#000000' : '#4A4A4A' },
                  ]}
                >
                  {option.label}
                </Text>
                {option.description ? (
                  <Text style={[styles.description, { color: theme.textSecondary }]}>
                    {option.description}
                  </Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  verticalContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },
  horizontalItemSpacing: {
    marginRight: 40,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  textContainer: {
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  selectedLabel: {
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
  unselectedLabel: {
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
