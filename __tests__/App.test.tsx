import { validateLoginForm, hasErrors } from '../src/features/auth/utils/validation';

describe('validateLoginForm', () => {
  it('flags empty email and password', () => {
    const errors = validateLoginForm({ email: '', password: '' });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(hasErrors(errors)).toBe(true);
  });

  it('flags malformed email and short password', () => {
    const errors = validateLoginForm({ email: 'nope', password: 'short' });
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('passes a valid credential pair', () => {
    const errors = validateLoginForm({
      email: 'user@example.com',
      password: 'supersecret',
    });
    expect(hasErrors(errors)).toBe(false);
  });
});
