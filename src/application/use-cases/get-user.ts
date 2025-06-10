import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}