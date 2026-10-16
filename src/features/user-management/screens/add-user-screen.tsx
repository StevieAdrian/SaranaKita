import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { FormUser, type UserFormData } from '../components/form-user';
import { useUserManagement } from '../hooks/use-user-management';

export function AddUserScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { theme } = useRole();
  const { createUser } = useUserManagement();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    setSubmitting(true);
    try {
      await createUser(data);
      navigation.goBack();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Tambah Pengguna"
        onBack={() => navigation.goBack()}
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
