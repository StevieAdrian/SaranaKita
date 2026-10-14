import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/shared/hooks/use-theme';
import { MIN_TOUCH_SIZE, radius, spacing } from '@/shared/theme';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps): React.JSX.Element {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const isDisabled = Boolean(disabled) || loading;
  const isPrimary = variant === 'primary';

  const backgroundColor = isPrimary ? theme.colors.primary : theme.colors.borderSubtle;
  const textColor = isPrimary ? theme.colors.onPrimary : theme.colors.text;

  const handlePressIn = (e: GestureResponderEvent) => {
    setPressed(true);
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    setPressed(false);
    onPressOut?.(e);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        { backgroundColor },
        style,
        (isDisabled || pressed) && styles.dimmed,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, theme.typography.button, { color: textColor }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_SIZE,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  dimmed: {
    opacity: 0.6,
  },
});
