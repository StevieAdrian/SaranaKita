export function isRoleAdminOrStaff(role?: string | null): boolean {
  return role === 'administrator' || role === 'staff';
}
