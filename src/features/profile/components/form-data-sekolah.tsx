import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BaseCard,
  ConfirmationModal,
  FormField,
  Input,
  Select,
} from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';
import { CLASS_OPTIONS } from '../utils/constants';

export type SchoolFormData = {
  schoolName: string;
  classOrPosition: string;
};

export type FormDataSekolahProps = {
  schoolName?: string;
  initialClassOrPosition?: string;
  onSubmit: (data: SchoolFormData) => Promise<void>;
  loading?: boolean;
};

export function FormDataSekolah({
  schoolName = 'Belum Terhubung Sekolah',
  initialClassOrPosition,
  onSubmit,
  loading = false,
}: FormDataSekolahProps): React.JSX.Element {
  const { theme, currentRole } = useRole();
  const isSiswa = currentRole === 'siswa';

  const [classOrPosition, setClassOrPosition] = useState(
    initialClassOrPosition ?? '',
  );

  useEffect(() => {
    if (initialClassOrPosition !== undefined) {
      setClassOrPosition(initialClassOrPosition);
    }
  }, [initialClassOrPosition]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = isSiswa
    ? 'Kelas'
    : currentRole === 'staff'
      ? 'Jabatan Staff'
      : 'Jabatan';

  const handlePressSave = () => {
    if (!classOrPosition.trim()) {
      setError(`${label} wajib diisi.`);
      return;
    }
    setError(null);
    setConfirmVisible(true);
  };

  const handleConfirmSave = async () => {
    try {
      await onSubmit({
        schoolName,
        classOrPosition,
      });
      setConfirmVisible(false);
      Alert.alert('Sukses', 'Data sekolah berhasil diperbarui.');
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan data sekolah.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BaseCard style={styles.formCard}>
        {/* Nama Sekolah */}
        <FormField label="Nama Sekolah">
          <View
            style={[
              styles.readOnlyContainer,
              { borderColor: theme.borderInput },
            ]}
          >
            <Text style={styles.readOnlyText}>
              {schoolName}
            </Text>
          </View>
        </FormField>

        {/* Kelas / Jabatan */}
        <FormField label={label} required error={error ?? undefined}>
          {isSiswa ? (
            <Select
              value={classOrPosition}
              options={CLASS_OPTIONS}
              onChange={setClassOrPosition}
              placeholder="Pilih Kelas"
              sheetTitle="Pilih Kelas"
            />
          ) : (
            <Input
              value={classOrPosition}
              onChangeText={setClassOrPosition}
              placeholder={`Masukkan ${label.toLowerCase()}`}
              hasError={Boolean(error)}
            />
          )}
        </FormField>
      </BaseCard>

      {/* Button */}
      <Pressable
        onPress={handlePressSave}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Simpan Perubahan"
        style={({ pressed }) => [
          styles.saveButton,
          { backgroundColor: theme.primarySoft },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.saveText, { color: theme.onPrimary }]}>
          Simpan Perubahan
        </Text>
      </Pressable>

      <ConfirmationModal
        visible={confirmVisible}
        title="Simpan Perubahan?"
        message="Pastikan data sekolah yang Anda masukkan sudah benar."
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
        loading={loading}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  formCard: {
    gap: spacing.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  readOnlyContainer: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: '#D1D5DB',
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
