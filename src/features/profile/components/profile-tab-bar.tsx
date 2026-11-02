import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { PROFILE_TABS, profileFonts, type ProfileTab } from '../utils/constants';

export type ProfileTabBarProps = {
  activeTab: ProfileTab;
  onSelectTab: (tab: ProfileTab) => void;
};

export function ProfileTabBar({
  activeTab,
  onSelectTab,
}: ProfileTabBarProps): React.JSX.Element {
  const { theme } = useRole();

  return (
    <View style={styles.tabContainer}>
      {/* Navigasi Active Bar */}
      {PROFILE_TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Pressable
            key={tab}
            onPress={() => onSelectTab(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab}
            style={[
              styles.tabItem,
              isActive && [styles.activeTabItem, { borderBottomColor: theme.onPrimary }],
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                { color: isActive ? theme.onPrimary : '#94A3B8' },
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    marginBottom: -StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: 14,
  },
  activeTabLabel: {
    fontFamily: profileFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  inactiveTabLabel: {
    fontFamily: profileFonts.regular,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
  },
});

