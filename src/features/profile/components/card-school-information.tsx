import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseCard } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';

export type SchoolDetail = {
  name: string;
  address: string;
  npsn: string;
  principal: string;
  phone: string;
  accreditation: string;
};

export type CardSchoolInformationProps = {
  school?: Partial<SchoolDetail>;
};

const DEFAULT_SCHOOL: SchoolDetail = {
  name: 'Belum Terhubung Sekolah',
  address: '-',
  npsn: '-',
  principal: '-',
  phone: '-',
  accreditation: '-',
};

export function CardSchoolInformation({
  school,
}: CardSchoolInformationProps): React.JSX.Element {
  const { theme } = useRole();
  const info = { ...DEFAULT_SCHOOL, ...school };

  const fields = [
    { label: 'Nama Sekolah', value: info.name },
    { label: 'Alamat', value: info.address },
    { label: 'NPSN', value: info.npsn },
    { label: 'Kepala Sekolah', value: info.principal },
    { label: 'Telepon', value: info.phone },
    { label: 'Akreditasi', value: info.accreditation },
  ];

  return (
    <BaseCard style={styles.card}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: theme.textHeading }]}
      >
        Informasi Sekolah
      </Text>

      <View style={styles.fieldsList}>
        {fields.map((field) => (
          <View key={field.label} style={styles.fieldItem}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              {field.label}
            </Text>
            <Text style={[styles.fieldValue, { color: theme.textHeading }]}>
              {field.value}
            </Text>
          </View>
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  fieldsList: {
    gap: spacing.sm,
  },
  fieldItem: {
    gap: 2,
  },
  fieldLabel: {
    fontSize: 11,
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
