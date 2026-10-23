import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import leftArrow from '@/assets/images/left-arrow.png';
import { useRole } from '@/shared/context/theme-context';
import { hitSlop, spacing } from '@/shared/theme';
import { userFonts } from '../utils/constants';

export type UserFormHeaderProps = {
  title: string;
  onBack: () => void;
};

export function UserFormHeader({ title, onBack }: UserFormHeaderProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { theme } = useRole();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          paddingTop: insets.top + spacing.md,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
            style={styles.backButton}
          >
            <Image
              source={leftArrow}
              resizeMode="contain"
              style={[styles.backIcon, { tintColor: theme.onPrimary }]}
            />
          </Pressable>
        ) : null}
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[styles.title, { color: theme.onPrimary }]}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  contentRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 44,
    height: 44,
    justifyContent: 'center',
    zIndex: 1,
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  title: {
    fontFamily: userFonts.semiBold,
    fontSize: 20,
    textAlign: 'center',
    paddingHorizontal: 48,
  },
});
