import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';

describe('User Entity', () => {
  test('should create a user with valid input', () => {
    const user = User.create('1', 'John Doe', 'john@example.com');
    expect(user.getId()).toBe('1');
    expect(user.getName()).toBe('John Doe');
    expect(user.getEmail()).toBe('john@example.com');
  });

  test('should throw an error if id is missing', () => {
    expect(() => User.create('', 'John Doe', 'john@example.com')).toThrow('ID and name are required');
  });

  test('should throw an error if name is missing', () => {
    expect(() => User.create('1', '', 'john@example.com')).toThrow('ID and name are required');
  });

  test('should throw an error if email is invalid', () => {
    expect(() => User.create('1', 'John Doe', 'invalid')).toThrow('Invalid email address');
  });
});