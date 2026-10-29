import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import actionRequiredIcon from '@/assets/images/need-action.png';
import {
  REPORT_STATUS,
  type FeedReport,
} from '@/services/report';
import { USER_ROLE } from '@/services/auth';
import { ReportThumbnail, StatusBadge } from '@/shared/components/report';
import { getThemeColors } from '@/shared/theme';
import { HomeHeader } from '../components/home-header';
import { ReportStatusSummary } from '../components/report-status-summary';
import { useAdminDashboard } from '../hooks/use-admin-dashboard';
import { useCurrentUser } from '../hooks/use-current-user';
import { toDisplayDate } from '../utils/feed';
import { useRole } from '@/shared/context/theme-context';

const STAFF_PRIMARY = getThemeColors(USER_ROLE.STAFF).primary;
const ACTION_COLOR = '#A51920';

function UrgentReportCard({
  report,
  onPress,
}: {
  report: FeedReport;
  onPress: () => void;
}): React.JSX.Element {
  const { theme } = useRole();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Buka laporan ${report.title}`}
      style={{ backgroundColor: theme.surface }}
      className="flex-row gap-2 rounded-lg p-3 active:opacity-80"
    >
      <ReportThumbnail uri={report.imageUrl} className="h-20 w-20 rounded-md" />
      <View className="flex-1 gap-1">
        <Text numberOfLines={1} style={{ color: theme.textHeading }} className="text-sm font-bold">
          {report.title}
        </Text>
        <Text numberOfLines={1} style={{ color: theme.textSecondary }} className="text-xs">
          {report.reporterName} · {toDisplayDate(report.createdAt)}
        </Text>
        <StatusBadge status={report.status} size="sm" />
        <Text style={{ color: theme.textSecondary }} className="text-xs">
          <Text style={{ color: theme.textHeading }} className="font-bold">{report.votes}</Text>
          {'  '}Votes{'   '}
          <Text style={{ color: theme.textHeading }} className="font-bold">{report.comments}</Text>
          {'  '}Komentar
        </Text>
      </View>
    </Pressable>
  );
}

export function StaffHomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useCurrentUser();
  const { dashboard, loading, refreshing, error, refresh } =
    useAdminDashboard();

  if (!dashboard && loading) {
    return (
      <View className="flex-1 items-center justify-center bg-page">
        <ActivityIndicator color={STAFF_PRIMARY} />
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View className="flex-1 bg-page">
        <View
          className="gap-5 px-5 pb-8"
          style={{
            backgroundColor: STAFF_PRIMARY,
            paddingTop: insets.top + 24,
          }}
        >
          <HomeHeader
            name={`Staff ${user?.displayName ?? ''}`.trim()}
            schoolName={null}
          />
        </View>
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-sm text-gray-500">
            {error ?? 'Data dashboard belum tersedia.'}
          </Text>
          <Pressable
            onPress={refresh}
            accessibilityRole="button"
            className="min-h-[44px] justify-center rounded-lg px-5"
            style={{ backgroundColor: STAFF_PRIMARY }}
          >
            <Text className="font-semibold text-white">Coba lagi</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { statusCounts } = dashboard;
  const openReports =
    statusCounts[REPORT_STATUS.WAITING_VERIFICATION] +
    statusCounts[REPORT_STATUS.IN_REVIEW] +
    statusCounts[REPORT_STATUS.IN_REPAIR];
  const maxCategoryCount = Math.max(
    1,
    ...dashboard.categories.map(category => category.count),
  );
  const openReportHistory = () => navigation.navigate('ReportHistory');

  const { theme } = useRole();
  return (
    <View style={{ backgroundColor: theme.background }} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View
          className="gap-5 px-5 pb-5"
          style={{
            backgroundColor: STAFF_PRIMARY,
            paddingTop: insets.top + 24,
          }}
        >
          <HomeHeader
            name={`Staff ${user?.displayName ?? ''}`.trim()}
            schoolName={dashboard.schoolName}
          />
          <View className="min-h-[60px] flex-row items-center gap-4 rounded-lg bg-white/10 px-4 py-3">
            <Text className="text-2xl font-bold text-white">
              {dashboard.totalThisMonth}
            </Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-white">
                Total Laporan Bulan Ini
              </Text>
              <Text className="text-xs text-white/70">
                Akumulasi laporan masuk
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-5 px-5 pt-5">
          {error ? (
            <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={openReportHistory}
            accessibilityRole="button"
            className="min-h-[60px] flex-row items-center rounded-lg px-5 active:opacity-90"
            style={{ backgroundColor: ACTION_COLOR }}
          >
            <Image
              source={actionRequiredIcon}
              resizeMode="contain"
              className="mr-3 h-6 w-6"
              accessibilityElementsHidden
            />
            <View className="flex-1">
              <Text className="text-xl font-bold leading-6 text-white">
                {openReports}
              </Text>
              <Text className="text-sm font-medium text-white">
                Perlu Tindakan
              </Text>
            </View>
            <Text className="text-xl text-white">›</Text>
          </Pressable>

          <ReportStatusSummary dashboard={dashboard} variant="staff" />

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text style={{ color: theme.textHeading }} className="text-base font-bold">
                Perlu Tindakan Segera
              </Text>
              <Pressable
                onPress={openReportHistory}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Text className="text-xs font-semibold text-blue-800">
                  Lihat Semua
                </Text>
              </Pressable>
            </View>
            {dashboard.urgentReports.length > 0 ? (
              dashboard.urgentReports.map(report => (
                <UrgentReportCard
                  key={report.id}
                  report={report}
                  onPress={() =>
                    navigation.navigate('ManagementReportDetail', {
                      reportId: report.id,
                    })
                  }
                />
              ))
            ) : (
              <Text className="rounded-lg bg-white px-4 py-5 text-sm text-gray-500">
                Belum ada laporan yang perlu segera diverifikasi.
              </Text>
            )}
          </View>

          <View className="gap-3">
            <Text style={{ color: theme.textHeading }} className="text-base font-bold">
              Laporan Per Kategori
            </Text>
            <View style={{ backgroundColor: theme.surface }} className="gap-4 rounded-lg p-4">
              {dashboard.categories.map(category => (
                <View
                  key={category.id}
                  className="flex-row items-center gap-3"
                >
                  <Text
                    numberOfLines={1}
                    style={{ color: theme.textSecondary }} className="w-20 text-xs"
                  >
                    {category.name}
                  </Text>
                  <View style={{ backgroundColor: theme.borderSubtle }} className="h-2 flex-1 overflow-hidden rounded-full">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${(category.count / maxCategoryCount) * 100}%`,
                        backgroundColor: STAFF_PRIMARY,
                      }}
                    />
                  </View>
                  <Text style={{ color: theme.textMuted }} className="w-5 text-right text-xs">
                    {category.count}
                  </Text>
                </View>
              ))}
              {dashboard.categories.length === 0 ? (
                <Text className="text-sm text-gray-500">
                  Belum ada kategori laporan.
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
