import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/shared/hooks/use-theme';
import type { TypographyVariant } from '@/shared/theme';

export type ThemedTextProps = TextProps & {
  variant?: TypographyVariant;
  muted?: boolean;
};

export function ThemedText({
  variant = 'body',
  muted = false,
  style,
  ...rest
}: ThemedTextProps): React.JSX.Element {
  const theme = useTheme();
  return (
    <Text
      style={[
        theme.typography[variant],
        { color: muted ? theme.colors.textMuted : theme.colors.text },
        style,
      ]}
      {...rest}
    />
  );
}
