export function formatClassOrPosition(
  role?: string | null,
  rawClassOrPos?: string | null,
): string {
  const text = (rawClassOrPos || '').trim();
  const lower = text.toLowerCase();
  const userRole = (role || 'siswa').toLowerCase();

  if (userRole === 'siswa') {
    if (!text) return 'Kelas -';
    if (lower.startsWith('kelas')) return text;
    return `Kelas ${text}`;
  }

  if (userRole === 'guru') {
    if (!text) return 'Guru';
    if (lower.includes('guru')) return text;
    return `Guru ${text}`;
  }

  if (userRole === 'staff') {
    if (!text) return 'Staff';
    if (lower.includes('staff')) return text;
    return `Staff ${text}`;
  }

  if (userRole === 'administrator') {
    if (!text) return 'Administrator';
    if (lower.includes('admin')) return text;
    return `Administrator ${text}`;
  }

  return text || '-';
}
