import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMySchool } from '@/services/school';
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
  const [schoolName, setSchoolName] = useState<string>('Belum Terhubung Sekolah');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'siswa' | 'guru' | 'staff'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, summaryRes, schoolRes] = await Promise.all([
        getUsers({ limit: 50 }).catch(() => null),
        getUserSummary().catch(() => null),
        getMySchool().catch(() => null),
      ]);

      if (usersRes) {
        setUsers(usersRes.items.filter((u) => u.role !== 'administrator'));
      }
      if (summaryRes) {
        setSummary(summaryRes);
      }
      if (schoolRes?.name) {
        setSchoolName(schoolRes.name);
      } else {
        setSchoolName('Belum Terhubung Sekolah');
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
      if (user.role === 'administrator') {
        return false;
      }

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
    loadData().catch(() => { });
  };

  const handleUpdateUser = async (id: string, input: UpdateUserInput) => {
    const updated = await updateUser(id, input);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    getUserSummary().then(setSummary).catch(() => { });
    loadData().catch(() => { });
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    getUserSummary().then(setSummary).catch(() => { });
    loadData().catch(() => { });
  };

  return {
    users: filteredUsers,
    totalCount: users.length,
    summary,
    schoolName,
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
