import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { ManageUser } from '@/services/users';
import { ScreenHeader } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { FormUser, type UserFormData } from '../components/form-user';
import { useUserManagement } from '../hooks/use-user-management';

export function EditUserScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { theme } = useRole();
  const { updateUser } = useUserManagement();

  const user: ManageUser | undefined = route.params?.user;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    if (!user?.id) return;
    setSubmitting(true);
    try {
      await updateUser(user.id, {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        classOrPosition: data.classOrPosition,
        status: data.status,
      });
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Edit Pengguna"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <FormUser
          mode="edit"
          initialData={{
            fullName: user?.fullName ?? user?.username ?? '',
            email: user?.email ?? '',
            role: user?.role ?? 'siswa',
            classOrPosition: user?.classOrPosition ?? '',
            status: user?.status ?? 'active',
            avatarUrl: user?.avatarUrl,
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
