import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useRole } from '@/shared/context/theme-context';
import { FormUser, type UserFormData } from '../components/form-user';
import { DEFAULT_USER_PASSWORD } from '../utils/constants';
import { UserFormHeader } from '../components/user-form-header';
import { useUserManagement } from '../hooks/use-user-management';
import { isRoleAdminOrStaff } from '../utils/permissions';

export function AddUserScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { theme, currentRole } = useRole();
  const { createUser } = useUserManagement();
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isRoleAdminOrStaff(currentRole)) {
      navigation.goBack();
    }
  }, [currentRole, navigation]);

  const handleSubmit = async (data: UserFormData) => {
    setSubmitting(true);
    try {
      const cleanData = { ...data };
      delete cleanData.confirmPassword;
      await createUser({
        ...cleanData,
        password: data.password || DEFAULT_USER_PASSWORD,
        isActive: data.isActive !== undefined ? data.isActive : data.status === 'active',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Main' },
            {
              name: 'UserManagement',
              params: {
                toastMessage: 'Pengguna berhasil ditambahkan.',
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
        title="Tambah Pengguna"
        onBack={() => navigation.navigate('UserManagement')}
      />

      <View style={styles.content}>
        <FormUser
          mode="add"
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
