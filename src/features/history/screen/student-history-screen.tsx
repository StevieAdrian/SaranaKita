import { useRole } from '@/shared/context/theme-context';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { USER_ROLE } from '@/services/auth';
import { useHistoryReports } from '../hooks/use-history-reports';
import { HistoryHeader } from '../components/history-header';
import { AllReportsHistory } from '../components/all-history-reports';
import { HistoryFilter } from '..';
import { EvaluasiSheet } from '../components/evaluasi-sheet';
import { useReportEvaluasi } from '../hooks/use-report-evaluasi';
import type { FeedReport } from '@/services/report';
import { useCurrentUser } from '@/features/home/hooks/use-current-user';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { getReportEvaluasi } from '@/services/report/feed.api';

export function StudentHistoryScreen(): React.JSX.Element {
  const { theme } = useRole();
  const { reports, refresh } = useHistoryReports();
  const [filterTab, setFilterTab] = useState<HistoryFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<FeedReport | null>(null);
  const [evaluatedReportIds, setEvaluatedReportIds] = useState<Set<string>>(
    new Set(),
  );
  const currentUser = useCurrentUser();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleViewEvaluations = (report: FeedReport) => {
    navigation.navigate('EvaluationReport', {
      reportId: report.id,
      reportTitle: report.title,
    });
  };
  useEffect(() => {
    let active = true;

    async function checkEvaluations() {
      if (!currentUser?.id || reports.length === 0) {
        return;
      }

      const completedReports = reports.filter(
        report => report.status === 'done',
      );

      const results = await Promise.all(
        completedReports.map(async report => {
          try {
            const evaluations = await getReportEvaluasi(report.id);

            return {
              reportId: report.id,
              evaluatedByMe: evaluations.some(
                evaluation => evaluation.evaluator_id === currentUser.id,
              ),
            };
          } catch {
            return {
              reportId: report.id,
              evaluatedByMe: false,
            };
          }
        }),
      );

      if (active) {
        setEvaluatedReportIds(previous => {
          const next = new Set(previous);

          results.forEach(({ reportId, evaluatedByMe }) => {
            if (evaluatedByMe) {
              next.add(reportId);
            } else {
              next.delete(reportId);
            }
          });

          return next;
        });
      }
    }

    void checkEvaluations();

    return () => {
      active = false;
    };
  }, [currentUser?.id, reports]);

  const { submitEvaluasi } = useReportEvaluasi({
    onSuccess: async () => {
      setSelectedReport(null);
      refresh();
    },
  });

  return (
    <ScrollView
      className="flex-1 " style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    >
      <HistoryHeader
        role={USER_ROLE.SISWA}
        filterTab={filterTab}
        onFilterChange={setFilterTab}
        query={query}
        onQueryChange={setQuery}
      />

      <AllReportsHistory
        reports={reports}
        filter={filterTab}
        query={query}
        role={USER_ROLE.SISWA}
        onEvaluatePress={setSelectedReport}
        evaluatedReportIds={evaluatedReportIds}
        onViewEvaluations={handleViewEvaluations}
      />
      <EvaluasiSheet
        visible={selectedReport !== null}
        reportId={selectedReport?.id ?? null}
        reportTitle={selectedReport?.title ?? ''}
        onClose={() => setSelectedReport(null)}
        onSubmit={submitEvaluasi}
      />
    </ScrollView>
  );
}
