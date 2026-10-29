import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConfirmationModal, Toast } from '@/shared/components/ui';
import { ClassSelectField } from '@/features/auth/components';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { CLASS_OPTIONS, profileFonts } from '../utils/constants';

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
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const isDirty = classOrPosition.trim() !== (initialClassOrPosition ?? '').trim();

  const label = isSiswa
    ? 'Kelas'
    : currentRole === 'staff'
      ? 'Jabatan Staff'
      : currentRole === 'administrator'
        ? 'Jabatan Administrator'
        : 'Jabatan';

  const placeholder = isSiswa
    ? 'Pilih Kelas'
    : currentRole === 'staff'
      ? 'Masukkan Jabatan Staff'
      : currentRole === 'administrator'
        ? 'Masukkan Jabatan Administrator'
        : 'Masukkan Jabatan';

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
      setToast({
        visible: true,
        message: 'Data sekolah berhasil diperbarui.',
        type: 'success',
      });
    } catch {
      setConfirmVisible(false);
      setToast({
        visible: true,
        message: 'Terjadi kesalahan saat menyimpan data sekolah.',
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.root}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Nama Sekolah */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nama Sekolah</Text>
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>
                {schoolName}
              </Text>
            </View>
          </View>

          {/* Kelas / Jabatan */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{label}</Text>
            {isSiswa ? (
              <ClassSelectField
                hideLabel
                value={classOrPosition || null}
                onChange={(val) => {
                  setClassOrPosition(val);
                  if (error) setError(null);
                }}
                placeholder="Pilih Kelas"
                sheetTitle="Pilih Kelas"
                primaryColor={theme.primary}
                inputBoxStyle={[
                  styles.classInputBox,
                  error ? styles.textInputError : null,
                ]}
                inputTextStyle={styles.classInputText}
              />
            ) : (
              <TextInput
                value={classOrPosition}
                onChangeText={(text) => {
                  setClassOrPosition(text);
                  if (error) setError(null);
                }}
                placeholder={placeholder}
                placeholderTextColor="#94A3B8"
                style={[
                  styles.textInput,
                  error ? styles.textInputError : null,
                ]}
              />
            )}
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePressSave}
            disabled={!isDirty || loading}
            accessibilityRole="button"
            accessibilityLabel="Simpan Perubahan"
            style={[
              styles.saveButton,
              { backgroundColor: isDirty ? theme.primary : theme.primarySoft },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>
                Simpan Perubahan
              </Text>
            )}
          </TouchableOpacity>
        </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: spacing.xl * 2,
  },
  formContainer: {
    gap: 15,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: profileFonts.medium,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#000000',
  },
  readOnlyContainer: {
    height: 44,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  readOnlyText: {
    fontFamily: profileFonts.regular,
    fontSize: 14,
    color: '#1E1E1E',
  },
  textInput: {
    height: 44,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontFamily: profileFonts.regular,
    fontSize: 14,
    color: '#1E1E1E',
  },
  classInputBox: {
    height: 44,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    paddingHorizontal: 12,
  },
  classInputText: {
    fontFamily: profileFonts.regular,
    fontSize: 14,
    color: '#1E1E1E',
  },
  textInputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    fontFamily: profileFonts.regular,
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
  saveButton: {
    height: 48,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  saveText: {
    fontFamily: profileFonts.semiBold,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#FFFFFF',
  },
});
