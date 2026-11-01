import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { authClient } from '@/services/auth';
import type { ManageUser } from '@/services/users';
import { reloadSharedProfile } from '@/features/profile';
import { useRole } from '@/shared/context/theme-context';
import { NotFoundScreen } from '@/features/auth/screens/transitions';
import { FormUser, type UserFormData } from '../components/form-user';
import { UserFormHeader } from '../components/user-form-header';
import { useUserManagement } from '../hooks/use-user-management';
import { isRoleAdminOrStaff } from '../utils/permissions';

export function EditUserScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { theme, currentRole } = useRole();
  const { updateUser } = useUserManagement();

  const user: ManageUser | undefined = route.params?.user;
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isRoleAdminOrStaff(currentRole)) {
      navigation.goBack();
    }
  }, [currentRole, navigation]);

  if (!user?.id) {
    return (
      <NotFoundScreen
        navigation={navigation}
        message="Pengguna tidak ditemukan."
      />
    );
  }

  const handleSubmit = async (data: UserFormData) => {
    if (!user?.id) return;
    setSubmitting(true);
    try {
      await updateUser(user.id, {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        classOrPosition: data.classOrPosition,
        status: data.status,
        isActive: data.isActive !== undefined ? data.isActive : data.status === 'active',
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender ?? undefined,
        avatarUrl: data.avatarUrl,
      });
      if (user.id === authClient.getState().user?.id) {
        reloadSharedProfile().catch(() => { });
        authClient.restore().catch(() => { });
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Main' },
            {
              name: 'UserManagement',
              params: {
                toastMessage: 'Data pengguna berhasil diperbarui.',
                toastType: 'success',
              },
            },
          ],
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <UserFormHeader
        title="Edit Pengguna"
        onBack={() => navigation.navigate('UserManagement')}
      />

      <View style={styles.content}>
        <FormUser
          mode="edit"
          initialData={{
            username: user?.username ?? '',
            fullName: user?.fullName ?? user?.username ?? '',
            firstName:
              user?.firstName ??
              (user?.fullName ? user.fullName.split(' ')[0] : ''),
            lastName:
              user?.lastName ??
              (user?.fullName
                ? user.fullName.split(' ').slice(1).join(' ')
                : ''),
            email: user?.email ?? '',
            role:
              user?.role && user.role !== 'administrator'
                ? user.role
                : 'siswa',
            classOrPosition: user?.classOrPosition ?? '',
            status: user?.status ?? 'active',
            avatarUrl: user?.avatarUrl,
            phone: user?.phone ?? '',
            gender: (user?.gender as any) ?? 'Laki-Laki',
            dateOfBirth: user?.dateOfBirth ?? undefined,
          }}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
