import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { palette } from '@/shared/theme';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';
import { adminTheme, staffTheme } from '@/shared/theme/colors';
import { useRole } from '@/shared/context/theme-context';

const ICON_SIZE = 28;
const ROLE_COLORS: Record<string, string> = {
  siswa: palette.primary,
  guru: palette.teacherPrimary,
  staff: staffTheme.primary,
  administrator: adminTheme.primary,
};

export function BottomTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps): React.JSX.Element {
  const { theme } = useRole();
  const user = useCurrentUser();

  const activeColor = ROLE_COLORS[user?.role ?? ''] ?? theme.primary;

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row items-center rounded-t-[32px] px-4 pt-4"
      style={[
        styles.bar,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.shadowColor,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        if (!descriptor) {
          return null;
        }
        const { options } = descriptor;
        const focused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            testID={options.tabBarButtonTestID}
            className="min-h-[44px] flex-1 items-center justify-center active:opacity-60"
          >
            {options.tabBarIcon?.({
              focused,
              color: focused ? activeColor : theme.iconInactive,
              size: ICON_SIZE,
            })}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
});
