import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRole } from '@/shared/context/theme-context';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  uri?: string | null;
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

const SIZES: Record<AvatarSize, { size: number; fontSize: number }> = {
  sm: { size: 36, fontSize: 14 },
  md: { size: 48, fontSize: 18 },
  lg: { size: 68, fontSize: 24 },
  xl: { size: 92, fontSize: 32 },
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0];
  const second = parts[1]?.[0];
  if (first && second) {
    return `${first}${second}`.toUpperCase();
  }
  return (first ?? '?').toUpperCase();
}

export function Avatar({
  uri,
  source,
  name,
  size = 'md',
  style,
  backgroundColor,
}: AvatarProps): React.JSX.Element {
  const { theme } = useRole();
  const dimension = SIZES[size];

  const containerStyle: ViewStyle = {
    width: dimension.size,
    height: dimension.size,
    borderRadius: dimension.size / 2,
    backgroundColor: backgroundColor ?? theme.backgroundSubtle,
  };

  if (uri) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <Image
          source={{ uri }}
          resizeMode="cover"
          style={styles.image}
          accessibilityIgnoresInvertColors
        />
      </View>
    );
  }

  if (source) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <Image
          source={source}
          resizeMode="cover"
          style={styles.image}
          accessibilityIgnoresInvertColors
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle, style]}>
      <Text
        style={[
          styles.initials,
          {
            fontSize: dimension.fontSize,
            color: theme.primary,
          },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '700',
  },
});
