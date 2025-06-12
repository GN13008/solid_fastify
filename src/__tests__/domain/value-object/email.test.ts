import { Email } from '../../../domain/value-objects/email';

describe('Email Value Object', () => {
  test('should create an email with valid input', () => {
    const email = Email.create('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  test('should throw an error for invalid email', () => {
    expect(() => Email.create('invalid')).toThrow('Invalid email address');
  });

  test('should throw an error for empty email', () => {
    expect(() => Email.create('')).toThrow('Invalid email address');
  });
});
