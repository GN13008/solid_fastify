import { CreateUser, CreateUserInput } from '../../../application/use-cases/create-user';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/entities/user';

// Mock du repository
const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
};

describe('CreateUser Use Case', () => {
  let createUser: CreateUser;

  beforeEach(() => {
    createUser = new CreateUser(mockUserRepository);
    jest.clearAllMocks();
  });

  test('should call save with a valid user', async () => {
    const input: CreateUserInput = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    await createUser.execute(input);

    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  test('should throw an error for invalid email', async () => {
    const input: CreateUserInput = {
      id: '1',
      name: 'John Doe',
      email: 'invalid',
    };

    await expect(createUser.execute(input)).rejects.toThrow('Invalid email address');
  });
});