import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
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
  Toast,
} from '@/shared/components/ui';
import { palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';
import {
  CLASS_OPTIONS,
  DESCRIPTION_MAX_LENGTH,
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
  const { theme } = useRole();
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
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleConfirm = async () => {
    const result = await confirmSubmit();
    if (!result.ok) {
      cancelSubmit();
      setToast({
        visible: true,
        message: result.message || 'Gagal mengirim laporan.',
        type: 'error',
      });
      return;
    }
    reset();
    setToast({
      visible: true,
      message: 'Laporan terkirim. Terima kasih, laporan kamu sudah kami terima.',
      type: 'success',
    });
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
    }
    redirectTimerRef.current = setTimeout(() => {
      navigation.goBack();
    }, 1200);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
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
            className="flex-grow gap-4 rounded-t-2xl px-5 pt-6"
            style={{ backgroundColor: theme.surface, paddingBottom: insets.bottom + 24 }}
          >
            <FormField label="Bukti Laporan" error={errors.photo}>
              <PhotoPicker
                value={values.photo}
                onChange={photo => setField('photo', photo)}
                onError={message =>
                  setToast({ visible: true, message, type: 'error' })
                }
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

            <FormField label="Kelas / Lokasi" required error={errors.location}>
              <Select
                value={values.location || null}
                options={CLASS_OPTIONS}
                onChange={value => setField('location', value)}
                placeholder="Pilih Kelas"
                sheetTitle="Pilih Kelas"
                accessibilityLabel="Kelas atau Lokasi, wajib"
                hasError={Boolean(errors.location)}
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
              <Button
                title="Kirim Laporan"
                onPress={requestSubmit}
                style={SUBMIT_BUTTON}
              />
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
            <Text className="font-semibold text-navy">
              langsung terverifikasi untuk diproses
            </Text>
            .
          </>
        }
        confirmLabel="Ya, Buat Laporan"
        loading={submitting}
        onConfirm={handleConfirm}
        onCancel={cancelSubmit}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={() => {
          setToast(prev => ({ ...prev, visible: false }));
          if (toast.type === 'success' && redirectTimerRef.current) {
            clearTimeout(redirectTimerRef.current);
            redirectTimerRef.current = null;
            navigation.goBack();
          }
        }}
      />
    </View>
  );
}
