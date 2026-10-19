import { authConstants } from '../src/features/auth/constants';
import { hasErrors, validateLoginForm, validateRegisterForm } from '../src/features/auth/utils/validation';
import type { RegisterFormState } from '../src/features/auth/types';

describe('authConstants', () => {
  it('contains expected color palette and component sizing tokens', () => {
    expect(authConstants.colors.backgroundBlue).toBeDefined();
    expect(authConstants.colors.surface).toBeDefined();
    expect(authConstants.components.avatar.size).toBe(130);
    expect(authConstants.components.avatar.radius).toBe(65);
    expect(authConstants.components.card.borderRadius).toBe(11);
    expect(authConstants.components.button.height).toBe(44);
    expect(authConstants.spacing.screenMargin).toBe(34);
  });
});

describe('auth validation', () => {
  it('validates login form requirements', () => {
    const invalid = validateLoginForm({ email: '', password: '' });
    expect(invalid.email).toBeDefined();
    expect(invalid.password).toBeDefined();
    expect(hasErrors(invalid)).toBe(true);

    const valid = validateLoginForm({
      email: 'student@sekolah.id',
      password: 'strongPassword123',
    });
    expect(hasErrors(valid)).toBe(false);
  });

  it('validates register form complete requirements', () => {
    const emptyForm: RegisterFormState = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: new Date(),
      classGrade: '',
      gender: 'Male',
    };

    const errors = validateRegisterForm(emptyForm);
    expect(errors.username).toBeDefined();
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(errors.phone).toBeDefined();
    expect(errors.classGrade).toBeDefined();
    expect(hasErrors(errors)).toBe(true);

    const validForm: RegisterFormState = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      phone: '08123456789',
      dateOfBirth: new Date(2005, 0, 1),
      classGrade: '10-A',
      gender: 'Male',
    };

    expect(hasErrors(validateRegisterForm(validForm))).toBe(false);
  });

  it('requires gender to be explicitly selected', () => {
    const formWithoutGender: RegisterFormState = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      phone: '08123456789',
      dateOfBirth: new Date(2005, 0, 1),
      classGrade: '10-A',
      gender: null,
    };

    const errors = validateRegisterForm(formWithoutGender);
    expect(errors.gender).toBe('Gender is required.');
    expect(hasErrors(errors)).toBe(true);
  });
});
