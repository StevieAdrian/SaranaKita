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
import checkIcon from '@/assets/images/check.png';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { REPORT_PROGRESS, ReportProgress } from '@/shared/components/report';
import { RecommendationSheet, ScreenHeader } from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { ReportGallery } from '../components/report-gallery';
import {
  CommentSection,
  DetailStats,
  ReporterCard,
  ReportTimeline,
} from '../components/report-detail-sections';
import { useCurrentUser } from '../hooks/use-current-user';
import { useReportDetail } from '../hooks/use-report-detail';
import { formatIsoDate, formatReporterRole } from '../utils/detail-format';
type DetailRoute = RouteProp<
  { ReportDetail: { reportId: string } },
  'ReportDetail'
>;

export function ReportDetailScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { params } = useRoute<DetailRoute>();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const {
    report,
    loading,
    error,
    voting,
    recommending,
    rejecting,
    comments,
    commentsError,
    submittingComment,
    reload,
    toggleVote,
    toggleRecommendation,
    submitReject,
    submitComment,
  } = useReportDetail(params.reportId);

  const isTeacher = user?.role === 'guru';
  const canVote = user?.role === 'siswa';
  const canComment = canVote;

  const handleCommentSubmit = async (text: string): Promise<boolean> => {
    const message = await submitComment(text);
    if (message) {
      Alert.alert('Gagal mengirim komentar', message);
      return false;
    }
    return true;
  };

  const handleVote = async () => {
    const message = await toggleVote();
    if (message) {
      Alert.alert('Gagal menyimpan dukungan', message);
    }
  };

  const [showRecommendSheet, setShowRecommendSheet] = useState(false);

  const handleRecommendation = async (reason: string) => {
    const message = await toggleRecommendation(reason);
    if (message) {
      Alert.alert('Gagal menyimpan rekomendasi', message);
    } else {
      setShowRecommendSheet(false);
    }
  };

  const handleReject = async () => {
    if (!report) return;
    Alert.alert(
      'Tolak Laporan',
      'Apakah kamu yakin ingin menolak laporan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tolak',
          style: 'destructive',
          onPress: async () => {
            const message = await submitReject();
            if (message) {
              Alert.alert('Gagal menolak laporan', message);
            }
          },
        },
      ],
    );
  };

  const renderBody = () => {
    if (loading && !report) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={palette.navy} />
        </View>
      );
    }
    if (error || !report) {
      return (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-sm text-gray-500">
            {error ?? 'Laporan tidak ditemukan.'}
          </Text>
          <Pressable
            onPress={reload}
            accessibilityRole="button"
            className="min-h-[44px] justify-center rounded-lg bg-navy px-5 active:opacity-70"
          >
            <Text className="font-semibold text-white">Coba lagi</Text>
          </Pressable>
        </View>
      );
    }

    const progress = REPORT_PROGRESS[report.status];
    const hasTeacherBar = isTeacher && report.status !== 'rejected';
    const scrollContent = {
      paddingBottom: canVote || hasTeacherBar ? 24 : insets.bottom + 24,
    };

    return (
      <ScrollView contentContainerStyle={scrollContent}>
        <ReportGallery imageUrls={report.imageUrls} title={report.title} />
        <View className="-mt-6 gap-5 rounded-t-3xl bg-white px-5 pt-6">
          <View className="gap-2">
            <View className="flex-row items-start gap-3">
              <Text
                accessibilityRole="header"
                className="flex-1 text-2xl font-bold text-gray-900"
              >
                {report.title}
              </Text>
              {report.location ? (
                <View
                  className="mt-1 rounded-md px-2 py-0.5"
                  style={{ backgroundColor: palette.infoBackground }}
                >
                  <Text className="text-xs font-semibold text-navy">
                    {report.location}
                  </Text>
                </View>
              ) : null}
            </View>
            {report.category ? (
              <Text className="text-xs font-medium text-primary">
                {report.category.name}
              </Text>
            ) : null}
            <Text className="text-sm leading-5 text-gray-500">
              {report.description}
            </Text>
          </View>

          <DetailStats
            votes={report.votes}
            recommendations={report.recommendations}
            comments={report.comments}
          />

          <ReporterCard
            name={report.reporter.name}
            roleLabel={formatReporterRole(
              report.reporter.role,
              report.reporter.className,
            )}
            avatarUrl={report.reporter.avatarUrl}
            date={formatIsoDate(report.createdAt)}
          />

          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text
                accessibilityRole="header"
                className="text-lg font-bold text-gray-900"
              >
                Progres Laporan
              </Text>
              <View
                className="rounded-full px-3 py-0.5"
                style={{ backgroundColor: palette.infoBackground }}
              >
                <Text className="text-xs font-semibold text-primary">
                  {progress.percent}%
                </Text>
              </View>
            </View>
            <ReportProgress status={report.status} />
            <ReportTimeline events={report.timeline} color={progress.color} />
          </View>

          <CommentSection
            count={report.comments}
            userName={user?.displayName ?? ''}
            comments={comments}
            error={commentsError}
            canComment={canComment}
            submitting={submittingComment}
            onSubmit={handleCommentSubmit}
            onRetry={reload}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Detail Laporan" onBack={navigation.goBack} />
      <View className="flex-1">{renderBody()}</View>
      {report && canVote ? (
        <View
          className="bg-white px-5 pt-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <Pressable
            onPress={() => {
              handleVote().catch(() => {});
            }}
            disabled={voting}
            accessibilityRole="button"
            accessibilityState={{ busy: voting, selected: report.votedByMe }}
            className={`min-h-[52px] items-center justify-center rounded-xl active:opacity-80 ${
              report.votedByMe ? 'border border-primary bg-white' : 'bg-primary'
            }`}
          >
            {voting ? (
              <ActivityIndicator
                color={report.votedByMe ? palette.brand : palette.white}
              />
            ) : (
              <Text
                className={`text-base font-semibold ${
                  report.votedByMe ? 'text-primary' : 'text-white'
                }`}
              >
                {report.votedByMe ? 'Batalkan Dukungan' : 'Dukung Laporan'}
              </Text>
            )}
          </Pressable>
        </View>
      ) : null}
      {report && isTeacher && report.status !== 'rejected' ? (
        <View
          className="flex-row gap-3 px-5 pt-4"
          style={{
            backgroundColor: palette.teacherPrimary,
            paddingBottom: insets.bottom + 16,
          }}
        >
          {/* Tombol Tolak */}
          <Pressable
            onPress={() => {
              handleReject().catch(() => {});
            }}
            disabled={rejecting || recommending}
            accessibilityRole="button"
            accessibilityLabel="Tolak laporan"
            accessibilityState={{ busy: rejecting }}
            className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-white bg-transparent active:opacity-70"
          >
            {rejecting ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <>
                <Text className="text-base font-bold text-white">✕</Text>
                <Text className="text-base font-semibold text-white">Tolak</Text>
              </>
            )}
          </Pressable>
          {/* Tombol Rekomendasi */}
          <Pressable
            onPress={() => {
              setShowRecommendSheet(true);
            }}
            disabled={recommending || rejecting}
            accessibilityRole="button"
            accessibilityLabel={
              report.recommendedByMe
                ? 'Batalkan rekomendasi'
                : 'Rekomendasikan laporan'
            }
            accessibilityState={{ busy: recommending, selected: report.recommendedByMe }}
            className="min-h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-white active:opacity-80"
          >
            {recommending ? (
              <ActivityIndicator color={palette.teacherPrimary} />
            ) : (
              <>
                <Image
                  source={checkIcon}
                  resizeMode="contain"
                  className="h-4 w-4"
                  style={{ tintColor: palette.teacherText }}
                />
                <Text
                  className="text-base font-semibold"
                  style={{ color: palette.teacherText }}
                >
                  {report.recommendedByMe ? 'Direkomendasikan' : 'Rekomendasi'}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      ) : null}
      <RecommendationSheet
        visible={showRecommendSheet}
        loading={recommending}
        onSubmit={(reason) => {
          handleRecommendation(reason).catch(() => {});
        }}
        onCancel={() => setShowRecommendSheet(false)}
      />
    </View>
  );
}
