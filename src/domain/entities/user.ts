import { Email } from '../value-objects/email';

export class User {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: Email
  ) {}

  static create(id: string, name: string, email: string): User {
    if (!id || !name) {
      throw new Error('ID and name are required');
    }
    return new User(id, name, Email.create(email));
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email.getValue();
  }
}