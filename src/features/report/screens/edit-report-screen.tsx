import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
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
  CLASS_OPTIONS,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '../constants';
import { useCategories } from '../hooks/use-categories';
import { useEditReportForm } from '../hooks/use-edit-report-form';

const SUBMIT_BUTTON = {
  backgroundColor: palette.brand,
  minHeight: 52,
  borderRadius: 12,
} as const;

const SCROLL_CONTENT = { flexGrow: 1, paddingHorizontal: 16 } as const;

type EditRoute = RouteProp<
  { EditReport: { reportId: string } },
  'EditReport'
>;

export function EditReportScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<EditRoute>();
  const insets = useSafeAreaInsets();
  const reportId = route.params.reportId;

  const {
    values,
    errors,
    loading,
    loadError,
    confirmVisible,
    submitting,
    existingImageUrl,
    removeExistingImage,
    setField,
    requestSubmit,
    cancelSubmit,
    confirmSubmit,
    retryLoad,
  } = useEditReportForm(reportId);

  const categories = useCategories();

  const handleConfirm = async () => {
    const result = await confirmSubmit();

    if (!result.ok) {
      Alert.alert('Gagal mengedit laporan', result.message);
      return;
    }

    Alert.alert('Laporan diperbarui', 'Perubahan laporan berhasil disimpan.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View className="flex-1 bg-page">
      <ScreenHeader title="Edit Laporan" onBack={navigation.goBack} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-sm text-gray-600">
            Memuat data laporan...
          </Text>
        </View>
      ) : loadError ? (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="mb-4 text-center text-base text-gray-700">
            {loadError}
          </Text>
          <Button title="Coba Lagi" onPress={retryLoad} />
        </View>
      ) : (
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
              {existingImageUrl && !removeExistingImage && !values.photo ? (
                <FormField label="Foto Laporan Saat Ini">
                  <View className="h-[140px] overflow-hidden rounded-lg border border-field-border">
                    <Image
                      source={{ uri: existingImageUrl }}
                      resizeMode="cover"
                      className="h-full w-full"
                      accessibilityLabel="Foto laporan saat ini"
                    />
                    <View className="absolute bottom-2 right-2">
                      <Button
                        title="Hapus Foto Lama"
                        onPress={() => {
                          setField('photo', null);
                          // Penghapusan foto lama perlu ditangani secara eksplisit.
                        }}
                      />
                    </View>
                  </View>
                </FormField>
              ) : null}

              <FormField label="Foto Pengganti">
                <PhotoPicker
                  value={values.photo}
                  onChange={photo => setField('photo', photo)}
                />
                <Text className="mt-1 text-xs text-gray-500">
                  Jika tidak memilih foto baru, foto lama akan tetap digunakan.
                </Text>
              </FormField>

              <FormField label="Judul Laporan" required error={errors.title}>
                <Input
                  value={values.title}
                  onChangeText={text => setField('title', text)}
                  placeholder="Contoh: Proyektor Ruang 12B Rusak"
                  maxLength={TITLE_MAX_LENGTH}
                  returnKeyType="next"
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
                  hasError={Boolean(errors.categoryId)}
                  loading={categories.loading}
                  loadError={categories.error}
                  onRetry={categories.reload}
                  emptyText="Belum ada kategori."
                />
              </FormField>

              <FormField
                label="Kelas / Lokasi"
                required
                error={errors.location}
              >
                <Select
                  value={values.location || null}
                  options={CLASS_OPTIONS}
                  onChange={value => setField('location', value)}
                  placeholder="Pilih Kelas"
                  sheetTitle="Pilih Kelas"
                  hasError={Boolean(errors.location)}
                />
              </FormField>

              <FormField
                label="Tanggal Perkiraan Kerusakan"
                required
                error={errors.incidentDate}
              >
                <DatePicker
                  value={values.incidentDate}
                  onChange={date => setField('incidentDate', date)}
                  maximumDate={new Date()}
                  hasError={Boolean(errors.incidentDate)}
                />
              </FormField>

              <View className="mt-4">
                <Button
                  title="Simpan Perubahan"
                  onPress={requestSubmit}
                  style={SUBMIT_BUTTON}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <ConfirmSheet
        visible={confirmVisible}
        title="Simpan Perubahan?"
        message="Perubahan pada laporan ini akan disimpan."
        confirmLabel="Ya, Simpan"
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={cancelSubmit}
      />
    </View>
  );
}
