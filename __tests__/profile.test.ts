import { CLASS_OPTIONS } from '../src/features/profile/utils/constants';

describe('profile utils & constants', () => {
  it('defines valid class options for Siswa', () => {
    const values = CLASS_OPTIONS.map((c) => c.value);
    expect(values.length).toBeGreaterThan(0);
  });
});
