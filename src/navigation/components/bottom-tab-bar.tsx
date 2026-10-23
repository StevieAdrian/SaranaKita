import React from 'react';
import { Pressable, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { palette } from '@/shared/theme';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';
import { adminTheme, staffTheme } from '@/shared/theme/colors';

const ICON_SIZE = 28;
const SHADOW = { boxShadow: '0 -4px 12px rgba(15, 23, 42, 0.08)' } as const;
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
  const user = useCurrentUser();

  const activeColor = ROLE_COLORS[user?.role ?? ''] ?? palette.navy;

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row items-center rounded-t-[32px] bg-white px-4 pt-4"
      style={[SHADOW, { paddingBottom: Math.max(insets.bottom, 12) }]}
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
              color: focused ? activeColor : palette.tabInactive,
              size: ICON_SIZE,
            })}
          </Pressable>
        );
      })}
    </View>
  );
}
