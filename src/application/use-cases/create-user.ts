import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export interface CreateUserInput {
  id: string;
  name: string;
  email: string;
}

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<void> {
    const user = User.create(input.id, input.name, input.email);
    await this.userRepository.save(user);
  }
}