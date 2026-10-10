import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  ConfirmSheet,
  DatePicker,
  FormField,
  Input,
  PhotoPicker,
  ScreenHeader,
  Select,
} from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import {
  DESCRIPTION_MAX_LENGTH,
  REPORT_LOCATIONS,
  TITLE_MAX_LENGTH,
} from '../constants';
import { useCategories } from '../hooks/use-categories';
import { useCreateReportForm } from '../hooks/use-create-report-form';

const SUBMIT_BUTTON = {
  backgroundColor: palette.brand,
  minHeight: 52,
  borderRadius: 12,
} as const;

const SCROLL_CONTENT = { flexGrow: 1, paddingHorizontal: 16 } as const;

export function CreateReportScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    values,
    errors,
    confirmVisible,
    submitting,
    setField,
    requestSubmit,
    cancelSubmit,
    confirmSubmit,
    reset,
  } = useCreateReportForm();
  const categories = useCategories();

  const handleConfirm = async () => {
    const ok = await confirmSubmit();
    if (ok) {
      reset();
      Alert.alert('Laporan terkirim', 'Terima kasih, laporan kamu sudah kami terima.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View className="flex-1 bg-page">
      <ScreenHeader title="Buat Laporan" onBack={navigation.goBack} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={SCROLL_CONTENT}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="flex-grow gap-4 rounded-t-2xl bg-white px-5 pt-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <FormField label="Bukti Laporan" error={errors.photo}>
              <PhotoPicker
                value={values.photo}
                onChange={photo => setField('photo', photo)}
                hasError={Boolean(errors.photo)}
              />
            </FormField>

            <FormField label="Judul Laporan" required error={errors.title}>
              <Input
                value={values.title}
                onChangeText={text => setField('title', text)}
                placeholder="Contoh: Proyektor Ruang 12B Rusak"
                maxLength={TITLE_MAX_LENGTH}
                returnKeyType="next"
                accessibilityLabel="Judul Laporan, wajib"
                hasError={Boolean(errors.title)}
              />
            </FormField>

            <FormField label="Deskripsi" required error={errors.description}>
              <Input
                value={values.description}
                onChangeText={text => setField('description', text)}
                placeholder="Berikan Deskripsi Kerusakan"
                multiline
                maxLength={DESCRIPTION_MAX_LENGTH}
                accessibilityLabel="Deskripsi, wajib"
                hasError={Boolean(errors.description)}
              />
            </FormField>

            <FormField label="Kategori" required error={errors.categoryId}>
              <Select
                value={values.categoryId}
                options={categories.options}
                onChange={value => setField('categoryId', value)}
                placeholder="Pilih Kategori"
                sheetTitle="Pilih Kategori"
                accessibilityLabel="Kategori, wajib"
                hasError={Boolean(errors.categoryId)}
                loading={categories.loading}
                loadError={categories.error}
                onRetry={categories.reload}
                emptyText="Belum ada kategori."
              />
            </FormField>

            <FormField label="Kelas / Lokasi" required error={errors.locationId}>
              <Select
                value={values.locationId}
                options={REPORT_LOCATIONS}
                onChange={value => setField('locationId', value)}
                placeholder="Pilih kelas atau lokasi"
                sheetTitle="Pilih Kelas / Lokasi"
                accessibilityLabel="Kelas atau Lokasi, wajib"
                hasError={Boolean(errors.locationId)}
              />
            </FormField>

            <FormField
              label="Tanggal Perkiraan Kerusakan Laporan"
              required
              error={errors.incidentDate}
            >
              <DatePicker
                value={values.incidentDate}
                onChange={date => setField('incidentDate', date)}
                maximumDate={new Date()}
                accessibilityLabel="Tanggal perkiraan kerusakan, wajib"
                hasError={Boolean(errors.incidentDate)}
              />
            </FormField>

            <View className="mt-4">
              <Button title="Kirim Laporan" onPress={requestSubmit} style={SUBMIT_BUTTON} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmSheet
        visible={confirmVisible}
        title="Buat Laporan?"
        message={
          <>
            Laporan akan{' '}
            <Text className="font-semibold text-navy">langsung terverifikasi</Text> dan
            diteruskan ke pihak terkait.
          </>
        }
        confirmLabel="Ya, Buat Laporan"
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={cancelSubmit}
      />
    </View>
  );
}
