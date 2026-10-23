import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { BaseCard, ConfirmationModal, DatePicker, FormField, Input, RadioGroup, Toast } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';
import { toIsoDate } from '@/shared/utils/date';
import { GENDER_OPTIONS, profileFonts } from '../utils/constants';
import maleDefault from '@/assets/images/male-default.png';
import vectorEdit from '@/assets/images/vector-edit.png';
import womanDefault from '@/assets/images/woman-default.png';

export type ProfileFormData = {
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  avatarUrl?: string | null;
};

export type FormProfileProps = {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
};

function genderLabel(val?: string | null): string {
  if (!val) return 'Laki-Laki';
  const lower = val.trim().toLowerCase();
  if (lower === 'female' || lower === 'perempuan') return 'Perempuan';
  if (lower === 'male' || lower === 'laki-laki') return 'Laki-Laki';
  return 'Laki-Laki';
}

function parseName(fullName?: string, first?: string, last?: string): { firstName: string; lastName: string } {
  if (first !== undefined || last !== undefined) {
    return { firstName: first ?? '', lastName: last ?? '' };
  }
  const clean = (fullName ?? '').trim();
  if (!clean) return { firstName: '', lastName: '' };
  const parts = clean.split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : '',
  };
}

export function FormProfile({
  initialData,
  onSubmit,
  loading = false,
}: FormProfileProps): React.JSX.Element {
  const { theme } = useRole();

  const initialNames = parseName(initialData?.fullName, initialData?.firstName, initialData?.lastName);
  const [firstName, setFirstName] = useState(initialNames.firstName);
  const [lastName, setLastName] = useState(initialNames.lastName);
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [birthDate, setBirthDate] = useState<Date>(() => {
    if (initialData?.birthDate) {
      const parsed = new Date(initialData.birthDate);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date(2005, 7, 25);
  });
  const [gender, setGender] = useState(genderLabel(initialData?.gender));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatarUrl ?? null);
  const [picking, setPicking] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    if (loading) return;
    if (initialData?.fullName || initialData?.firstName !== undefined) {
      const names = parseName(initialData.fullName, initialData.firstName, initialData.lastName);
      setFirstName(names.firstName);
      setLastName(names.lastName);
    }
    if (initialData?.email) setEmail(initialData.email);
    if (initialData?.phone !== undefined) setPhone(initialData.phone);
    if (initialData?.birthDate) {
      const parsed = new Date(initialData.birthDate);
      if (!isNaN(parsed.getTime())) setBirthDate(parsed);
    }
    if (initialData?.gender) setGender(genderLabel(initialData.gender));
    if (initialData?.avatarUrl !== undefined) setAvatarUrl(initialData.avatarUrl ?? null);
  }, [
    initialData?.fullName,
    initialData?.firstName,
    initialData?.lastName,
    initialData?.email,
    initialData?.phone,
    initialData?.birthDate,
    initialData?.gender,
    initialData?.avatarUrl,
    loading,
  ]);

  const initialFirst = initialNames.firstName.trim();
  const initialLast = initialNames.lastName.trim();
  const initialPhone = (initialData?.phone ?? '').trim();
  const initialDobStr = initialData?.birthDate
    ? toIsoDate(new Date(initialData.birthDate))
    : (initialData ? toIsoDate(new Date(2005, 7, 25)) : '');
  const initialGender = genderLabel(initialData?.gender);
  const initialAvatar = initialData?.avatarUrl ?? null;

  const currentDobStr = toIsoDate(birthDate);

  const isDirty =
    firstName.trim() !== initialFirst ||
    lastName.trim() !== initialLast ||
    phone.trim() !== initialPhone ||
    currentDobStr !== initialDobStr ||
    gender !== initialGender ||
    (avatarUrl ?? null) !== initialAvatar;

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const cleanFirst = firstName.trim();
    if (!cleanFirst) {
      errs.firstName = 'First name wajib diisi.';
    }
    if (!phone.trim()) {
      errs.phone = 'Nomor Telepon wajib diisi.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePickAvatar = async () => {
    if (loading || picking) return;

    setPicking(true);
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.8,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        setToast({
          visible: true,
          message: result.errorMessage ?? 'Gagal memilih foto. Silakan coba lagi.',
          type: 'error',
        });
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        setToast({
          visible: true,
          message: 'Ukuran foto tidak boleh melebihi 5 MB.',
          type: 'error',
        });
        return;
      }

      setAvatarUrl(asset.uri);
    } catch {
      setToast({
        visible: true,
        message: 'Gagal membuka galeri. Silakan coba lagi.',
        type: 'error',
      });
    } finally {
      setPicking(false);
    }
  };

  const handlePressSave = () => {
    if (validate()) {
      setConfirmVisible(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      const combinedFullName = lastName.trim()
        ? `${firstName.trim()} ${lastName.trim()}`
        : firstName.trim();

      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        fullName: combinedFullName,
        email,
        phone: phone.trim(),
        birthDate: toIsoDate(birthDate),
        gender,
        avatarUrl,
      });
      setConfirmVisible(false);
      setToast({
        visible: true,
        message: 'Perubahan profil berhasil disimpan.',
        type: 'success',
      });
    } catch {
      setConfirmVisible(false);
      setToast({
        visible: true,
        message: 'Terjadi kesalahan saat menyimpan profil.',
        type: 'error',
      });
    }
  };

  const isFemale =
    gender === 'Perempuan' ||
    gender === 'Female' ||
    gender.toLowerCase() === 'female' ||
    gender.toLowerCase() === 'perempuan';
  const defaultAvatarSource = isFemale ? womanDefault : maleDefault;

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
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Pressable
              onPress={handlePickAvatar}
              disabled={loading || picking}
              accessibilityRole="button"
              accessibilityLabel="Pilih Foto Profil"
              style={styles.avatarFrame}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                  accessibilityRole="image"
                  accessibilityLabel="Profile Avatar"
                />
              ) : (
                <Image
                  source={defaultAvatarSource}
                  style={styles.defaultAvatarImage}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel="Profile Avatar"
                />
              )}
            </Pressable>

            <Pressable
              onPress={handlePickAvatar}
              disabled={loading || picking}
              accessibilityRole="button"
              accessibilityLabel="Ganti foto profil"
              style={styles.editBadge}
            >
              {picking ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Image
                  source={vectorEdit}
                  resizeMode="contain"
                  style={styles.editIcon}
                  accessibilityElementsHidden
                />
              )}
            </Pressable>
          </View>
        </View>

        {/* Form Card */}
        <BaseCard style={styles.formCard}>
          {/* First Name & Last Name */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <FormField label="First Name" required error={errors.firstName}>
                <Input
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (errors.firstName) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.firstName;
                        return copy;
                      });
                    }
                  }}
                  placeholder="Doe"
                  hasError={Boolean(errors.firstName)}
                  autoCapitalize="words"
                />
              </FormField>
            </View>
            <View style={styles.gridCol}>
              <FormField label="Last Name" error={errors.lastName}>
                <Input
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (errors.lastName) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.lastName;
                        return copy;
                      });
                    }
                  }}
                  placeholder="Doe"
                  hasError={Boolean(errors.lastName)}
                  autoCapitalize="words"
                />
              </FormField>
            </View>
          </View>

          <FormField label="Email" required>
            <Input
              value={email}
              editable={false}
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityState={{ disabled: true }}
            />
          </FormField>

          <FormField label="Nomor Telepon" required error={errors.phone}>
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="08xxxxxxxxxx"
              keyboardType="phone-pad"
              hasError={Boolean(errors.phone)}
            />
          </FormField>

          <FormField label="Tanggal Lahir" required>
            <DatePicker
              value={birthDate}
              onChange={setBirthDate}
            />
          </FormField>

          <FormField label="Gender" required>
            <RadioGroup
              options={GENDER_OPTIONS}
              value={gender}
              onChange={setGender}
              direction="horizontal"
            />
          </FormField>
        </BaseCard>

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

        <ConfirmationModal
          visible={confirmVisible}
          title="Simpan Perubahan?"
          message="Pastikan data profil yang Anda masukkan sudah benar."
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
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
    width: 148,
    height: 148,
  },
  avatarFrame: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatarImage: {
    width: 148,
    height: 148,
  },
  defaultAvatarImage: {
    width: 112,
    height: 113,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FDFDFD',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#000000',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    gap: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    marginBottom: 52,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  gridCol: {
    flex: 1,
  },
  saveButton: {
    height: 48,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: spacing.xl,
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
