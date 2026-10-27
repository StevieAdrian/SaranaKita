import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import filterIcon from '@/assets/images/filter.png';
import leftArrow from '@/assets/images/left-arrow.png';
import searchIcon from '@/assets/images/search.png';
import { useRole } from '@/shared/context/theme-context';
import { hitSlop } from '@/shared/theme';
import { SummaryCard, type UserCountMetric } from './summary-card';
import { ROLE_FILTER_CHIPS, userFonts, userManagementColors } from '../utils/constants';

export type HeaderUserManagementProps = {
  totalUsers?: number;
  schoolName?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPressFilter: () => void;
  activeFilterCount?: number;
  roleFilter: 'all' | 'siswa' | 'guru' | 'staff';
  onRoleFilterChange: (role: 'all' | 'siswa' | 'guru' | 'staff') => void;
  summary?: {
    siswa: UserCountMetric;
    guru: UserCountMetric;
    staff: UserCountMetric;
  };
};

export function HeaderUserManagement({
  totalUsers = 0,
  schoolName = 'Belum Terhubung Sekolah',
  searchQuery,
  onSearchChange,
  onPressFilter,
  activeFilterCount = 0,
  roleFilter,
  onRoleFilterChange,
  summary,
}: HeaderUserManagementProps): React.JSX.Element {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useRole();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.primaryHeader,
          {
            backgroundColor: theme.primary,
            paddingTop: insets.top + 12,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => (navigation as any).navigate('Main', { screen: 'Profile' })}
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

          <View style={styles.titleCol}>
            <Text
              accessibilityRole="header"
              style={[styles.headerTitle, { color: theme.onPrimary }]}
            >
              Manajemen Pengguna
            </Text>
            <Text style={styles.headerSubtitle}>
              {schoolName} · {totalUsers} pengguna
            </Text>
          </View>
        </View>

        {/* Card Jumlah Pengguna */}
        <View style={styles.summaryContainer}>
          <SummaryCard
            siswa={summary?.siswa}
            guru={summary?.guru}
            staff={summary?.staff}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.whiteSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Cari Nama"
              placeholderTextColor="#979797"
              style={styles.searchInput}
              accessibilityLabel="Cari nama pengguna"
            />
            <Image
              source={searchIcon}
              resizeMode="contain"
              style={styles.searchIcon}
            />
          </View>

          {/* Filter */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressFilter}
            accessibilityRole="button"
            accessibilityLabel="Filter status pengguna"
            style={[
              styles.filterButton,
              activeFilterCount > 0 && { borderColor: theme.primary },
            ]}
          >
            <Image
              source={filterIcon}
              resizeMode="contain"
              style={[
                styles.filterIcon,
                {
                  tintColor:
                    activeFilterCount > 0 ? theme.primary : '#737373',
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
          </TouchableOpacity>
        </View>

        <View style={styles.chipsRow}>
          {ROLE_FILTER_CHIPS.map((chip) => {
            const isSelected = roleFilter === chip.value;
            return (
              <Pressable
                key={chip.value}
                onPress={() => onRoleFilterChange(chip.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.chip,
                  isSelected
                    ? [
                      styles.chipSelected,
                      {
                        backgroundColor:
                          theme.primary === '#112D71'
                            ? '#DBEAFE'
                            : 'rgba(54, 7, 7, 0.1)',
                        borderColor:
                          theme.primary === '#112D71'
                            ? '#2563EB'
                            : theme.primary,
                      },
                    ]
                    : styles.chipUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected
                      ? [
                        styles.chipTextSelected,
                        {
                          color:
                            theme.primary === '#112D71'
                              ? '#2563EB'
                              : theme.primary,
                        },
                      ]
                      : styles.chipTextUnselected,
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  primaryHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topBar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  backIcon: {
    width: 14,
    height: 24,
  },
  titleCol: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontFamily: userFonts.semiBold,
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: userFonts.regular,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  summaryContainer: {
    marginTop: 14,
  },
  whiteSection: {
    backgroundColor: userManagementColors.white,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchField: {
    flex: 1,
    height: 40,
    backgroundColor: userManagementColors.white,
    borderWidth: 1,
    borderColor: userManagementColors.text.subtle,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: userFonts.regular,
    fontSize: 12,
    color: '#1E1E1E',
    paddingVertical: 0,
  },
  searchIcon: {
    width: 16,
    height: 16,
    tintColor: '#979797',
    marginLeft: 6,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: userManagementColors.white,
    borderWidth: 1,
    borderColor: userManagementColors.text.subtle,
    borderRadius: 5,
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
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  chip: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  chipSelected: {},
  chipUnselected: {
    backgroundColor: userManagementColors.white,
    borderColor: userManagementColors.text.subtle,
  },
  chipText: {
    fontFamily: userFonts.medium,
    fontSize: 12,
  },
  chipTextSelected: {},
  chipTextUnselected: {
    color: userManagementColors.text.subtle,
  },
  pressed: {
    opacity: 0.7,
  },
});
