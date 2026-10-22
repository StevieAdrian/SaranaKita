import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ReportNoteSheetProps } from '../types';

const MIN_LENGTH = 10;
const MAX_LENGTH = 300;

export function ReportNoteSheet({
  visible,
  mode,
  initialNote = '',
  onClose,
  onSave,
  buttonColor = '#173577',
}: ReportNoteSheetProps): React.JSX.Element {
  const [noteText, setNoteText] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === 'edit';
  const trimmedText = noteText.trim();

  const isValid =
    trimmedText.length >= MIN_LENGTH && trimmedText.length <= MAX_LENGTH;

  const isUnchanged = isEdit && trimmedText === initialNote.trim();

  useEffect(() => {
    if (visible) {
      setNoteText(initialNote);
      setError(null);
    }
  }, [visible, initialNote]);

  const handleSave = async () => {
    if (!isValid || isSaving || isUnchanged) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(trimmedText);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan catatan. Silakan coba lagi.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={isSaving ? () => {} : onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          className="flex-1"
          disabled={isSaving}
          onPress={onClose}
          accessibilityLabel="Tutup pop-up"
        />

        <View className="rounded-t-3xl bg-white px-6 pb-9 pt-3">
          <View className="mb-7 h-1.5 w-12 self-center rounded-full bg-gray-200" />

          <Text className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Ubah Catatan' : 'Tambahkan Catatan'}
          </Text>

          <Text className="mt-1 text-base leading-6 text-gray-400">
            Catatan yang ditambahkan akan ditambahkan
            {'\n'}dalam deskripsi laporan terbuat
          </Text>

          <TextInput
            value={noteText}
            onChangeText={value => {
              setNoteText(value);
              setError(null);
            }}
            placeholder="Tuliskan catatan evaluasi untuk perbaikan ini (min. 10 karakter)..."
            placeholderTextColor="#888888"
            multiline
            maxLength={MAX_LENGTH}
            textAlignVertical="top"
            editable={!isSaving}
            accessibilityLabel="Catatan evaluasi"
            className="mt-6 min-h-[130px] rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-base text-gray-900"
          />

          <Text className="mt-3 text-right text-sm text-gray-400">
            {noteText.length}/{MAX_LENGTH}
          </Text>

          {error && (
            <Text
              accessibilityRole="alert"
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </Text>
          )}

          <Pressable
            onPress={handleSave}
            disabled={!isValid || isSaving || isUnchanged}
            accessibilityRole="button"
            className="mt-6 min-h-[60px] items-center justify-center rounded-lg active:opacity-80"
            style={{
              backgroundColor:
                !isValid || isSaving || isUnchanged ? '#DBEAFE' : buttonColor,
            }}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                className="text-lg font-bold"
                style={{
                  color: !isValid || isUnchanged ? '#94A3B8' : '#FFFFFF',
                }}
              >
                Simpan
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              if (!isSaving) onClose();
            }}
            disabled={isSaving}
            accessibilityRole="button"
            className="mt-6 min-h-[60px] items-center justify-center rounded-lg bg-blue-100 active:opacity-80"
          >
            <Text className="text-lg font-bold text-slate-400">Batal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
