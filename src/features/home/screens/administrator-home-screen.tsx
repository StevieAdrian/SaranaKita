import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import verificationIcon from '@/assets/images/verif.png';
import actionRequiredIcon from '@/assets/images/need-action.png';
import examinationIcon from '@/assets/images/examination.png';
import repairIcon from '@/assets/images/repair.png';
import {
  REPORT_STATUS,
  type FeedReport,
  type ReportStatus,
} from '@/services/report';
import { USER_ROLE } from '@/services/auth';
import { ReportThumbnail, StatusBadge } from '@/shared/components/report';
import { REPORT_STATUS_META } from '@/shared/components/report/report-status';
import { getThemeColors } from '@/shared/theme';
import { HomeHeader } from '../components/home-header';
import { useAdminDashboard } from '../hooks/use-admin-dashboard';
import {
  useAdminReportList,
  type AdminReportFilter,
} from '../hooks/use-admin-report-list';
import { toDisplayDate } from '../utils/feed';

const ADMIN_PRIMARY = getThemeColors(USER_ROLE.ADMINISTRATOR).primary;

const STATUS_ROWS: readonly {
  status: ReportStatus;
  label: string;
  color: string;
}[] = [
  {
    status: REPORT_STATUS.WAITING_VERIFICATION,
    label: REPORT_STATUS_META[REPORT_STATUS.WAITING_VERIFICATION].label,
    color: '#2563EB',
  },
  {
    status: REPORT_STATUS.IN_REVIEW,
    label: REPORT_STATUS_META[REPORT_STATUS.IN_REVIEW].label,
    color: '#F59E0B',
  },
  {
    status: REPORT_STATUS.IN_REPAIR,
    label: REPORT_STATUS_META[REPORT_STATUS.IN_REPAIR].label,
    color: '#9A3412',
  },
  {
    status: REPORT_STATUS.REJECTED,
    label: REPORT_STATUS_META[REPORT_STATUS.REJECTED].label,
    color: '#B91C1C',
  },
  {
    status: REPORT_STATUS.DONE,
    label: REPORT_STATUS_META[REPORT_STATUS.DONE].label,
    color: '#15803D',
  },
];

function CountTile({
  count,
  label,
  color,
  icon,
  selected,
  onPress,
}: {
  count: number;
  label: string;
  color: string;
  icon: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`min-h-[88px] flex-1 flex-row items-center gap-2.5 rounded-lg border px-3 py-3 active:opacity-90 ${
        selected ? 'border-white' : 'border-transparent'
      }`}
      style={{ backgroundColor: color }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        className="h-6 w-6 shrink-0"
        accessibilityElementsHidden
      />
      <View className="flex-1 gap-0.5">
        <Text className="text-2xl font-bold leading-7 text-white">{count}</Text>
        <Text className="text-[13px] font-medium leading-[18px] text-white">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function ReportCard({
  report,
  onPress,
}: {
  report: FeedReport;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Buka laporan ${report.title}`}
      className="flex-row gap-2 rounded-lg bg-white p-3 active:opacity-80"
    >
      <ReportThumbnail uri={report.imageUrl} className="h-20 w-20 rounded-md" />
      <View className="flex-1 gap-1">
        <Text numberOfLines={1} className="text-sm font-bold text-gray-900">
          {report.title}
        </Text>
        <Text numberOfLines={1} className="text-xs text-gray-500">
          {report.reporterName} · {toDisplayDate(report.createdAt)}
        </Text>
        <StatusBadge status={report.status} size="sm" />
        <Text className="text-xs text-gray-600">
          <Text className="font-bold text-gray-900">{report.votes}</Text>
          {'  '}Votes{'   '}
          <Text className="font-bold text-gray-900">{report.comments}</Text>
          {'  '}Komentar
        </Text>
      </View>
    </Pressable>
  );
}

export function AdministratorHomeScreen({
  name = 'Administrator',
  primaryColor = ADMIN_PRIMARY,
}: {
  name?: string;
  primaryColor?: string;
}): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { dashboard, loading, refreshing, error, refresh } =
    useAdminDashboard();
  const [reportFilter, setReportFilter] =
    React.useState<AdminReportFilter>('all');
  const reportList = useAdminReportList(reportFilter);

  const refreshDashboard = () => {
    refresh();
    reportList.refresh();
  };

  if (!dashboard && loading) {
    return (
      <View className="flex-1 items-center justify-center bg-page">
        <ActivityIndicator color={primaryColor} />
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View className="flex-1 bg-page">
        <View
          className="gap-5 px-5 pb-8"
          style={{
            backgroundColor: primaryColor,
            paddingTop: insets.top + 24,
          }}
        >
          <HomeHeader name={name} schoolName={null} />
        </View>
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-sm text-gray-500">
            {error ?? 'Data dashboard belum tersedia.'}
          </Text>
          <Pressable
            onPress={refresh}
            accessibilityRole="button"
            className="min-h-[44px] justify-center rounded-lg px-5"
            style={{ backgroundColor: primaryColor }}
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
  const totalForPercent = dashboard.totalReports;
  const filterLabel = reportFilter === 'all' ? 'Semua Laporan' : reportFilter === 'action_required' ? 'Perlu Tindakan' : STATUS_ROWS.find(row => row.status === reportFilter)?.label ?? 'Semua Laporan';

  return (
    <View className="flex-1 bg-[#ECF3FD]">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing || reportList.loading}
            onRefresh={refreshDashboard}
          />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        <View
          className="gap-5 px-5 pb-8"
          style={{
            backgroundColor: primaryColor,
            paddingTop: insets.top + 24,
          }}
        >
          <HomeHeader name={name} schoolName={dashboard.schoolName} />
          <View className="flex-row items-center gap-4 rounded-lg bg-white/10 px-4 py-3">
            <Text className="text-xl font-bold text-white">
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
          <View className="gap-3 rounded-lg bg-white/10 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-white">
                {dashboard.totalReports} Laporan Masuk
              </Text>
              <Text className="text-[10px] text-white/80">
                Data terakhir: {toDisplayDate(dashboard.generatedAt)}
              </Text>
            </View>
            <View className="h-2 flex-row overflow-hidden rounded-full bg-white/10">
              {STATUS_ROWS.map((row: (typeof STATUS_ROWS)[number]) => {
                const { status, color } = row;
                const percent =
                  totalForPercent > 0
                    ? (statusCounts[status] / totalForPercent) * 100
                    : 0;
                return percent > 0 ? (
                  <View
                    key={status}
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                ) : null;
              })}
            </View>
            <View className="gap-2">
              {STATUS_ROWS.map((row: (typeof STATUS_ROWS)[number]) => {
                const { status, label, color } = row;
                const count = statusCounts[status];
                const percent =
                  totalForPercent > 0
                    ? Math.round((count / totalForPercent) * 100)
                    : 0;
                return (
                  <Pressable
                    key={status}
                    onPress={() => setReportFilter(status)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: reportFilter === status }}
                    className={`flex-row items-center justify-between rounded px-1 py-0.5 ${
                      reportFilter === status ? 'bg-white/10' : ''
                    }`}
                  >
                    <View className="flex-1 flex-row items-center gap-2">
                      <View
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <Text className="text-xs text-white">{label}</Text>
                    </View>
                    <Text className="w-8 text-center text-xs text-white">
                      {count}
                    </Text>
                    <Text className="w-9 text-right text-xs text-white">
                      {percent}%
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View className="gap-6 px-5 pt-3">
          {error ? (
            <View className="rounded-lg bg-red-100 px-4 py-3">
              <Text className="text-sm text-red-800">{error}</Text>
            </View>
          ) : null}

          <View className="gap-2">
            <View className="flex-row gap-2">
              <CountTile
                count={statusCounts[REPORT_STATUS.WAITING_VERIFICATION]}
                label={
                  REPORT_STATUS_META[REPORT_STATUS.WAITING_VERIFICATION].label
                }
                icon={verificationIcon}
                color="#2563EB"
                selected={reportFilter === REPORT_STATUS.WAITING_VERIFICATION}
                onPress={() =>
                  setReportFilter(REPORT_STATUS.WAITING_VERIFICATION)
                }
              />
              <CountTile
                count={openReports}
                label="Perlu Tindakan"
                icon={actionRequiredIcon}
                color="#B91C1C"
                selected={reportFilter === 'action_required'}
                onPress={() => setReportFilter('action_required')}
              />
            </View>
            <View className="flex-row gap-2">
              <CountTile
                count={statusCounts[REPORT_STATUS.IN_REVIEW]}
                label={REPORT_STATUS_META[REPORT_STATUS.IN_REVIEW].label}
                icon={examinationIcon}
                color="#F59E0B"
                selected={reportFilter === REPORT_STATUS.IN_REVIEW}
                onPress={() => setReportFilter(REPORT_STATUS.IN_REVIEW)}
              />
              <CountTile
                count={statusCounts[REPORT_STATUS.IN_REPAIR]}
                label={REPORT_STATUS_META[REPORT_STATUS.IN_REPAIR].label}
                icon={repairIcon}
                color="#854D0E"
                selected={reportFilter === REPORT_STATUS.IN_REPAIR}
                onPress={() => setReportFilter(REPORT_STATUS.IN_REPAIR)}
              />
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">
                {filterLabel}
              </Text>
              {reportFilter !== 'all' ? (
                <Pressable
                  onPress={() => setReportFilter('all')}
                  accessibilityRole="button"
                >
                  <Text className="text-xs font-semibold text-blue-700">
                    Tampilkan Semua
                  </Text>
                </Pressable>
              ) : null}
            </View>
            {reportList.error ? (
              <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
                {reportList.error}
              </Text>
            ) : reportList.loading && reportList.reports.length === 0 ? (
              <ActivityIndicator color={primaryColor} />
            ) : reportList.reports.length ? (
              reportList.reports.map(report => (
                <ReportCard
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
                Tidak ada laporan untuk filter ini.
              </Text>
            )}
            {reportList.hasMore ? (
              <Pressable
                onPress={reportList.loadMore}
                disabled={reportList.loadingMore}
                accessibilityRole="button"
                className="min-h-[44px] items-center justify-center rounded-lg bg-white"
              >
                {reportList.loadingMore ? (
                  <ActivityIndicator color={primaryColor} />
                ) : (
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Muat Laporan Lainnya
                  </Text>
                )}
              </Pressable>
            ) : null}
          </View>

          <View className="gap-3">
            <Text className="text-base font-bold text-gray-900">
              Laporan Per Kategori
            </Text>
            <View className="gap-4 rounded-lg bg-white p-4">
              {dashboard.categories.map(category => {
                const maxCount = Math.max(
                  1,
                  ...dashboard.categories.map(item => item.count),
                );
                const width = (category.count / maxCount) * 100;
                return (
                  <View
                    key={category.id}
                    className="flex-row items-center gap-3"
                  >
                    <Text
                      numberOfLines={1}
                      className="w-20 text-xs text-gray-700"
                    >
                      {category.name}
                    </Text>
                    <View className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${width}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </View>
                    <Text className="w-5 text-right text-xs text-gray-600">
                      {category.count}
                    </Text>
                  </View>
                );
              })}
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
