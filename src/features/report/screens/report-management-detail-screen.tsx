import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import checkIcon from '@/assets/images/check.png';
import leftArrow from '@/assets/images/left-arrow.png';
import { USER_ROLE } from '@/services/auth';
import { useSession } from '@/features/auth';
import {
  REPORT_STATUS_BY_NAME,
  REPORT_STATUS_NAME_BY_STATUS,
  REPORT_STATUS,
  REPORT_STATUS_NAME,
  REPORT_STATUS_NAMES,
  type ReportStatus,
  type UpdateReportStatusName,
} from '@/services/report';
import {
  ReportProgress,
  REPORT_PROGRESS,
} from '@/shared/components/report';
import { BottomSheet, ModalSuccess } from '@/shared/components/ui';
import { getThemeColors, palette } from '@/shared/theme';
import { ReportGallery } from '../components/report-gallery';
import {
  ReporterCard,
  ReportTimeline,
} from '../components/report-detail-sections';
import { useReportDetail } from '../hooks/use-report-detail';
import {
  formatIsoDate,
  formatReporterRole,
  formatShortDate,
} from '../utils/detail-format';

type ManagementDetailRoute = RouteProp<
  { ManagementReportDetail: { reportId: string } },
  'ManagementReportDetail'
>;

function DetailHeader({
  onBack,
  topInset,
  primaryColor,
}: {
  onBack: () => void;
  topInset: number;
  primaryColor: string;
}): React.JSX.Element {
  return (
    <View
      className="px-5 pb-5"
      style={{ backgroundColor: primaryColor, paddingTop: topInset + 12 }}
    >
      <View className="min-h-11 flex-row items-center justify-center">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          className="absolute left-0 h-11 w-11 justify-center"
        >
          <Image
            source={leftArrow}
            resizeMode="contain"
            className="h-6 w-6"
            style={{ tintColor: palette.white }}
          />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Detail Laporan</Text>
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}): React.JSX.Element {
  return (
    <View className="min-h-[38px] flex-row items-center px-3">
      <Text className="flex-1 text-xs text-[#475569]">{label}</Text>
      <Text className="w-10 text-center text-xs font-bold text-gray-900">
        {value}
      </Text>
      <Text className="w-20 text-right text-xs text-gray-700 underline">
        Lihat Detail
      </Text>
    </View>
  );
}

export function ReportManagementDetailScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<ManagementDetailRoute>();
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const primaryColor =
    user?.role === USER_ROLE.STAFF
      ? getThemeColors(USER_ROLE.STAFF).primary
      : getThemeColors(USER_ROLE.ADMINISTRATOR).primary;
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [verificationConfirmationOpen, setVerificationConfirmationOpen] =
    useState(false);
  const [rejectionConfirmationOpen, setRejectionConfirmationOpen] =
    useState(false);
  const [successModal, setSuccessModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const {
    report,
    loading,
    error,
    comments,
    commentsError,
    changingStatus,
    reload,
    changeStatus,
  } = useReportDetail(route.params.reportId);

  const updateStatus = async (
    statusName: UpdateReportStatusName,
  ) => {
    setStatusSheetOpen(false);
    const message = await changeStatus({ statusName });
    if (message) {
      Alert.alert('Gagal mengubah status', message);
      return;
    }

    const isVerification = statusName === REPORT_STATUS_NAME.IN_REVIEW;
    const isRejection = statusName === REPORT_STATUS_NAME.REJECTED;
    const successTitle = isVerification
      ? 'Verifikasi Berhasil'
      : isRejection
        ? 'Laporan Ditolak'
        : 'Status Berhasil Diperbarui';
    const successMessage = isVerification
      ? 'Laporan berhasil diverifikasi.'
      : isRejection
        ? 'Laporan berhasil ditolak.'
        : `Status laporan berhasil diubah menjadi ${statusName}.`;

    setSuccessModal({ title: successTitle, message: successMessage });
  };

  const handleReject = () => {
    setRejectionConfirmationOpen(true);
  };

  const handleVerify = () => {
    setVerificationConfirmationOpen(true);
  };

  const confirmVerification = () => {
    setVerificationConfirmationOpen(false);
    updateStatus(REPORT_STATUS_NAME.IN_REVIEW).catch(() => {});
  };

  const confirmRejection = () => {
    setRejectionConfirmationOpen(false);
    updateStatus(REPORT_STATUS_NAME.REJECTED).catch(() => {});
  };

  const header = (
    <DetailHeader
      onBack={navigation.goBack}
      topInset={insets.top}
      primaryColor={primaryColor}
    />
  );

  if (loading && !report) {
    return (
      <View className="flex-1 bg-white">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={primaryColor} />
        </View>
      </View>
    );
  }

  if (!report || error) {
    return (
      <View className="flex-1 bg-white">
        {header}
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-sm text-gray-500">
            {error ?? 'Laporan tidak ditemukan.'}
          </Text>
          <Pressable
            onPress={reload}
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

  const progress = REPORT_PROGRESS[report.status];
  const selectedStatus = REPORT_STATUS_NAME_BY_STATUS[report.status];
  const showVerify =
    report.status !== REPORT_STATUS.REJECTED &&
    report.status !== REPORT_STATUS.DONE;

  return (
    <View className="flex-1 bg-white">
      {header}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: showVerify ? 24 : insets.bottom + 24,
        }}
      >
        <ReportGallery imageUrls={report.imageUrls} title={report.title} />
        <View className="-mt-5 gap-4 rounded-t-3xl bg-white px-5 pt-5">
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <Text
                accessibilityRole="header"
                className="flex-1 text-xl font-bold leading-6 text-[#172033]"
              >
                {report.title}
              </Text>
              {report.reporter.className ? (
                <View className="rounded-full bg-[#F1F5F9] px-3 py-1">
                  <Text className="text-[10px] font-semibold text-[#172033]">
                    {report.reporter.className}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text className="text-sm leading-5 text-[#9AA0A8]">
              {report.description}
            </Text>
          </View>

          <View className="gap-2 bg-[#E5E5E5] px-3 py-4">
            <View className="flex-row items-center justify-between gap-2">
              <Text className="text-xs text-[#475569]">Catatan:</Text>
              {report.brokenDate ? (
                <Text className="text-[10px] text-[#475569]">
                  {formatShortDate(report.brokenDate)}
                </Text>
              ) : null}
            </View>
            <Text className="text-xs text-[#171717]">
              {report.brokenDate
                ? `Kerusakan dilaporkan sejak ${formatShortDate(report.brokenDate)}.`
                : 'Tidak ada catatan tambahan.'}
            </Text>
          </View>

          <View className="gap-1 rounded-lg bg-[#F1F5F9] py-1">
            <SummaryRow label="Jumlah Dukungan" value={report.votes} />
            <SummaryRow
              label="Jumlah Rekomendasi"
              value={report.recommendations}
            />
            <SummaryRow label="Jumlah Komentar" value={report.comments} />
          </View>

          <ReporterCard
            name={report.reporter.name}
            roleLabel={formatReporterRole(
              report.reporter.role,
              report.reporter.className,
            )}
            avatarUrl={report.reporter.avatarUrl}
            date={formatIsoDate(report.createdAt)}
          />

          <Pressable
            onPress={() => setStatusSheetOpen(true)}
            disabled={changingStatus}
            accessibilityRole="button"
            accessibilityLabel={`Ubah status laporan, sekarang ${selectedStatus}`}
            className="min-h-[52px] flex-row items-center justify-between rounded-lg border border-gray-100 px-4"
          >
            <Text className="text-xs font-semibold text-gray-900">
              Ubah Status
            </Text>
            <View className="flex-row items-center gap-3">
              {changingStatus ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : (
                <Text className="rounded-full bg-[#FEF3C7] px-4 py-1 text-[10px] font-semibold text-[#854D0E]">
                  {selectedStatus}
                </Text>
              )}
              <Text className="text-sm text-[#94A3B8]">⌄</Text>
            </View>
          </Pressable>

          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-[#172033]">
                Progres Laporan
              </Text>
              <Text className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                {progress.percent}%
              </Text>
            </View>
            <ReportProgress status={report.status} />
            <ReportTimeline events={report.timeline} color={progress.color} />
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-gray-200" />
              <Text className="text-xs text-gray-400">Diskusi</Text>
              <View className="h-px flex-1 bg-gray-200" />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-[#172033]">
                Komentar
              </Text>
              <Text className="rounded-full bg-[#F1F5F9] px-4 py-1 text-xs text-gray-700">
                {report.comments}
              </Text>
            </View>
            {commentsError ? (
              <View className="flex-row items-center justify-between gap-3">
                <Text className="flex-1 text-sm text-red-600">
                  {commentsError}
                </Text>
                <Pressable
                  onPress={reload}
                  accessibilityRole="button"
                  className="min-h-[40px] justify-center px-2"
                >
                  <Text
                    className="font-semibold"
                    style={{ color: primaryColor }}
                  >
                    Coba lagi
                  </Text>
                </Pressable>
              </View>
            ) : comments.length === 0 ? (
              <Text className="rounded-lg bg-gray-50 px-4 py-5 text-sm text-gray-500">
                Belum ada komentar.
              </Text>
            ) : (
              comments.map(comment => (
                <View key={comment.id} className="flex-row items-start gap-3">
                  {comment.avatarUrl ? (
                    <Image
                      source={{ uri: comment.avatarUrl }}
                      className="h-9 w-9 rounded-full bg-gray-200"
                    />
                  ) : (
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-[#16A765]">
                      <Text className="font-bold text-white">
                        {comment.authorName.trim().charAt(0).toUpperCase() ||
                          '?'}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1 gap-1 rounded-lg bg-gray-50 p-3">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className="flex-1 text-sm font-semibold text-gray-900">
                        {comment.authorName}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatShortDate(comment.createdAt)}
                      </Text>
                    </View>
                    <Text className="text-sm leading-5 text-gray-700">
                      {comment.commentText}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {showVerify ? (
        <View
          className="flex-row gap-3 px-5 pt-4"
          style={{
            backgroundColor: primaryColor,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <Pressable
            onPress={handleReject}
            disabled={changingStatus}
            accessibilityRole="button"
            className="min-h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-md border border-white"
          >
            {changingStatus ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <>
                <Text className="text-base text-white">×</Text>
                <Text className="text-sm font-semibold text-white">Tolak</Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={handleVerify}
            disabled={changingStatus}
            accessibilityRole="button"
            accessibilityLabel="Verifikasi laporan"
            className="min-h-[48px] flex-1 flex-row items-center justify-center gap-2 rounded-md bg-white"
          >
            {changingStatus ? (
              <ActivityIndicator color={primaryColor} />
            ) : (
              <>
                <Image
                  source={checkIcon}
                  resizeMode="contain"
                  className="h-5 w-5"
                  style={{ tintColor: primaryColor }}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{ color: primaryColor }}
                >
                  Verifikasi Laporan
                </Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}

      <BottomSheet
        visible={verificationConfirmationOpen}
        onClose={() => setVerificationConfirmationOpen(false)}
      >
        <View className="items-center px-2 pb-3 pt-4">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#EEF0FF]">
            <Image
              source={checkIcon}
              resizeMode="contain"
              className="h-7 w-7"
              style={{ tintColor: primaryColor }}
            />
          </View>
          <Text
            accessibilityRole="header"
            className="mb-4 text-center text-xl font-bold text-[#172033]"
          >
            Verifikasi Laporan?
          </Text>
          <Text className="mb-7 text-center text-base leading-6 text-[#64748B]">
            Laporan akan diverifikasi dan dipindahkan ke status Dalam
            Pemeriksaan.
          </Text>
          <View className="w-full gap-3">
            <Pressable
              onPress={confirmVerification}
              disabled={changingStatus}
              accessibilityRole="button"
              accessibilityLabel="Konfirmasi verifikasi laporan"
              className="min-h-[52px] items-center justify-center rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="text-base font-semibold text-white">
                Verifikasi Laporan
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setVerificationConfirmationOpen(false)}
              disabled={changingStatus}
              accessibilityRole="button"
              className="min-h-[52px] items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
            >
              <Text className="text-base font-semibold text-[#475569]">
                Batal
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        visible={rejectionConfirmationOpen}
        onClose={() => setRejectionConfirmationOpen(false)}
      >
        <View className="items-center px-2 pb-3 pt-4">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#FDECEC]">
            <Text
              accessibilityElementsHidden
              className="text-4xl font-light leading-[40px]"
              style={{ color: primaryColor }}
            >
              ×
            </Text>
          </View>
          <Text
            accessibilityRole="header"
            className="mb-4 text-center text-xl font-bold text-[#172033]"
          >
            Tolak Laporan?
          </Text>
          <Text className="mb-7 text-center text-base leading-6 text-[#64748B]">
            Laporan akan ditolak dan tidak diproses lebih lanjut.
          </Text>
          <View className="w-full gap-3">
            <Pressable
              onPress={confirmRejection}
              disabled={changingStatus}
              accessibilityRole="button"
              accessibilityLabel="Konfirmasi tolak laporan"
              className="min-h-[52px] items-center justify-center rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="text-base font-semibold text-white">
                Tolak Laporan
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRejectionConfirmationOpen(false)}
              disabled={changingStatus}
              accessibilityRole="button"
              className="min-h-[52px] items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
            >
              <Text className="text-base font-semibold text-[#475569]">
                Batal
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        visible={statusSheetOpen}
        onClose={() => setStatusSheetOpen(false)}
      >
        <Text className="mb-3 text-lg font-bold text-gray-900">
          Ubah Status Laporan
        </Text>
        {REPORT_STATUS_NAMES.map(statusName => {
          const selected =
            REPORT_STATUS_BY_NAME[statusName] === report.status;
          return (
            <Pressable
              key={statusName}
              onPress={() => updateStatus(statusName).catch(() => {})}
              disabled={changingStatus}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`min-h-[48px] justify-center rounded-lg px-3 ${
                selected ? 'bg-[#FEF3C7]' : ''
              }`}
            >
              <Text
                className={`text-sm ${
                  selected
                    ? 'font-semibold text-[#854D0E]'
                    : 'text-gray-800'
                }`}
              >
                {statusName}
              </Text>
            </Pressable>
          );
        })}
      </BottomSheet>

      <ModalSuccess
        visible={successModal !== null}
        title={successModal?.title ?? ''}
        message={successModal?.message ?? ''}
        buttonLabel="Kembali ke Beranda"
        buttonColor={primaryColor}
        onConfirm={() => {
          setSuccessModal(null);
          navigation.navigate('Main', { screen: 'Home' });
        }}
      />
    </View>
  );
}
