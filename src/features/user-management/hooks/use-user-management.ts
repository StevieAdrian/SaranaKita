import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createUser,
  deleteUser,
  getUsers,
  getUserSummary,
  updateUser,
  type CreateUserInput,
  type ManageUser,
  type UpdateUserInput,
  type UserSummary,
} from '@/services/users';

const EMPTY_SUMMARY: UserSummary = {
  totalSiswa: 0,
  totalGuru: 0,
  totalStaff: 0,
};

export function useUserManagement() {
  const [users, setUsers] = useState<ManageUser[]>([]);
  const [summary, setSummary] = useState<UserSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'siswa' | 'guru' | 'staff'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, summaryRes] = await Promise.all([
        getUsers({ limit: 50 }).catch(() => null),
        getUserSummary().catch(() => null),
      ]);

      if (usersRes) {
        setUsers(usersRes.items);
      }
      if (summaryRes) {
        setSummary(summaryRes);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role filter
      if (roleFilter !== 'all' && user.role !== roleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && (user.status ?? 'active') !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = user.fullName?.toLowerCase().includes(q);
        const emailMatch = user.email.toLowerCase().includes(q);
        const classMatch = user.classOrPosition?.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !classMatch) {
          return false;
        }
      }

      return true;
    });
  }, [users, roleFilter, statusFilter, searchQuery]);

  const handleCreateUser = async (input: CreateUserInput) => {
    const created = await createUser(input);
    setUsers((prev) => [created, ...prev]);
    getUserSummary().then(setSummary).catch(() => { });
  };

  const handleUpdateUser = async (id: string, input: UpdateUserInput) => {
    const updated = await updateUser(id, input);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    getUserSummary().then(setSummary).catch(() => { });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    getUserSummary().then(setSummary).catch(() => { });
  };

  return {
    users: filteredUsers,
    totalCount: users.length,
    summary,
    loading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    reload: loadData,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
  };
}
