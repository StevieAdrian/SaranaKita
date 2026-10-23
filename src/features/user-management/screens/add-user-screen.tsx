import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useRole } from '@/shared/context/theme-context';
import { FormUser, type UserFormData } from '../components/form-user';
import { UserFormHeader } from '../components/user-form-header';
import { useUserManagement } from '../hooks/use-user-management';

export function AddUserScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { theme } = useRole();
  const { createUser } = useUserManagement();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    setSubmitting(true);
    try {
      const { confirmPassword: _cp, ...cleanData } = data;
      await createUser({
        ...cleanData,
        password: data.password || 'SaranaKita123',
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
