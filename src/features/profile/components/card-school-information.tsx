import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BaseCard } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { profileFonts } from '../utils/constants';

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
  const info: SchoolDetail = {
    name: school?.name?.trim() ? school.name : DEFAULT_SCHOOL.name,
    address: school?.address?.trim() ? school.address : DEFAULT_SCHOOL.address,
    npsn: school?.npsn?.trim() ? school.npsn : DEFAULT_SCHOOL.npsn,
    principal: school?.principal?.trim() ? school.principal : DEFAULT_SCHOOL.principal,
    phone: school?.phone?.trim() ? school.phone : DEFAULT_SCHOOL.phone,
    accreditation: school?.accreditation?.trim() ? school.accreditation : DEFAULT_SCHOOL.accreditation,
  };

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
      <View style={styles.header}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: theme.textHeading }]}
        >
          Informasi Sekolah
        </Text>
      </View>

      <View style={styles.fieldsList}>
        {fields.map((field, idx) => (
          <View
            key={field.label}
            style={[
              styles.fieldItem,
              idx === fields.length - 1 && styles.lastFieldItem,
            ]}
          >
            <Text style={[styles.fieldLabel, { color: theme.textMuted || '#94A3B8' }]}>
              {field.label}
            </Text>
            <Text style={[styles.fieldValue, { color: theme.textBody || '#374151' }]}>
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
    marginHorizontal: 20,
    marginTop: 10,
    padding: 0,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontFamily: profileFonts.bold,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    lineHeight: 23,
  },
  fieldsList: {
    paddingVertical: 2,
  },
  fieldItem: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFF',
  },
  lastFieldItem: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    fontFamily: profileFonts.regular,
    fontSize: 11,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    lineHeight: 16,
  },
  fieldValue: {
    fontFamily: profileFonts.medium,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    lineHeight: 21,
    marginTop: 2,
  },
});
