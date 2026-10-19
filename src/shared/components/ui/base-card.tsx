import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';

export type BaseCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityLabel?: string;
};

export function BaseCard({
  children,
  style,
  onPress,
  disabled,
  accessibilityRole,
  accessibilityLabel,
}: BaseCardProps): React.JSX.Element {
  const { theme } = useRole();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.borderSubtle,
    shadowColor: theme.shadowColor,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.card,
          cardStyle,
          style,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
