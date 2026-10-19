import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import filterIcon from '@/assets/images/filter.png';
import leftArrow from '@/assets/images/left-arrow.png';
import searchIcon from '@/assets/images/search.png';
import { useRole } from '@/shared/context/theme-context';
import { hitSlop, radius, spacing } from '@/shared/theme';

export type HeaderUserManagementProps = {
  totalUsers?: number;
  schoolName?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPressFilter: () => void;
  activeFilterCount?: number;
};

export function HeaderUserManagement({
  totalUsers = 0,
  schoolName = 'Jakarta',
  searchQuery,
  onSearchChange,
  onPressFilter,
  activeFilterCount = 0,
}: HeaderUserManagementProps): React.JSX.Element {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useRole();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          paddingTop: insets.top + spacing.sm,
        },
      ]}
    >
      {/* Header Card */}
      <View style={styles.topRow}>
        <Pressable
          onPress={() => navigation.goBack()}
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

        <View style={styles.titleContainer}>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.onPrimary }]}
          >
            Manajemen Pengguna
          </Text>
          <Text style={[styles.subtitle, { color: theme.textInactiveOnPrimary }]}>
            {schoolName} · {totalUsers} pengguna
          </Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchField,
            {
              backgroundColor: theme.surface,
              borderColor: theme.borderInput,
            },
          ]}
        >
          <Image
            source={searchIcon}
            resizeMode="contain"
            style={[styles.searchIcon, { tintColor: theme.textSecondary }]}
          />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Cari pengguna..."
            placeholderTextColor={theme.textPlaceholder}
            style={[styles.searchInput, { color: theme.textHeading }]}
            accessibilityLabel="Cari pengguna"
          />
        </View>

        <Pressable
          onPress={onPressFilter}
          accessibilityRole="button"
          accessibilityLabel="Filter status pengguna"
          style={({ pressed }) => [
            styles.filterButton,
            {
              backgroundColor: theme.surface,
              borderColor: activeFilterCount > 0 ? theme.primary : theme.borderInput,
            },
            pressed && styles.pressed,
          ]}
        >
          <Image
            source={filterIcon}
            resizeMode="contain"
            style={[
              styles.filterIcon,
              {
                tintColor: activeFilterCount > 0 ? theme.primary : theme.textHeading,
              },
            ]}
          />
          {activeFilterCount > 0 ? (
            <View
              style={[
                styles.filterBadge,
                { backgroundColor: theme.primary },
              ]}
            />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    width: 22,
    height: 22,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});
