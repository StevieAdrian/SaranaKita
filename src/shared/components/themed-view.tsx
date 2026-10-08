import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/shared/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  surface?: boolean;
};

export function ThemedView({
  surface = false,
  style,
  ...rest
}: ThemedViewProps): React.JSX.Element {
  const theme = useTheme();
  return (
    <View
      style={[
        { backgroundColor: surface ? theme.colors.surface : theme.colors.background },
        style,
      ]}
      {...rest}
    />
  );
}
