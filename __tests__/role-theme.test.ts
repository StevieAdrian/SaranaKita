import { USER_ROLES } from '../src/services/auth/types';
import {
  DEFAULT_THEME_ROLE,
  THEME_ROLES,
  appThemes,
  getTheme,
  getThemeColors,
} from '../src/shared/theme';

describe('role themes', () => {
  it('covers exactly the backend roles', () => {
    expect([...THEME_ROLES]).toEqual([...USER_ROLES]);
    expect(Object.keys(appThemes).sort()).toEqual([...USER_ROLES].sort());
  });

  it.each(THEME_ROLES)('defines light and dark tokens for %s with identical keys', role => {
    const { light, dark } = appThemes[role];
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
    for (const value of [...Object.values(light), ...Object.values(dark)]) {
      expect(value).toMatch(/^(#[0-9A-F]{6}|rgba\([\d.,\s]+\))$/);
    }
  });

  it('falls back to the default role when no role is known', () => {
    expect(getThemeColors(null)).toBe(appThemes[DEFAULT_THEME_ROLE].light);
    expect(getThemeColors(undefined, 'dark')).toBe(appThemes[DEFAULT_THEME_ROLE].dark);
  });

  it('keeps success green for Guru while the active badge stays amber', () => {
    const guru = getThemeColors('guru');
    expect(guru.success).toBe(getThemeColors('siswa').success);
    expect(guru.badgeActive).toBe('#F59E0B');
  });

  it('returns a cached theme object per role and scheme', () => {
    expect(getTheme('staff', 'dark')).toBe(getTheme('staff', 'dark'));
    expect(getTheme('staff', 'dark').colors.primary).toBe(appThemes.staff.dark.primary);
  });
});
