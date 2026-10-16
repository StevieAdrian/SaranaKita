import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { PROFILE_TABS, type ProfileTab } from '../utils/constants';

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
                { color: isActive ? theme.onPrimary : theme.textInactiveOnPrimary },
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
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
  },
  tabLabel: {
    fontSize: 13,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  inactiveTabLabel: {
    fontWeight: '500',
  },
});
