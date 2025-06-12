import { GetUser } from '../../../application/use-cases/get-user';
import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/entities/user';

// Mock du repository
const mockUserRepository: jest.Mocked<UserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
};

describe('GetUser Use Case', () => {
  let getUser: GetUser;

  beforeEach(() => {
    getUser = new GetUser(mockUserRepository);
    jest.clearAllMocks();
  });

  test('should return a user when found', async () => {
    const mockUser = User.create('1', 'John Doe', 'john@example.com');
    mockUserRepository.findById.mockResolvedValue(mockUser);

    const user = await getUser.execute('1');

    expect(user).toEqual(mockUser);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
  });

  test('should return null when user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    const user = await getUser.execute('1');

    expect(user).toBeNull();
    expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
  });
});