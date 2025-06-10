import Fastify, { FastifyInstance } from 'fastify';
import { InMemoryUserRepository } from '../persistence/in-memory-user-repository';
import { CreateUser } from '../../application/use-cases/create-user';
import { GetUser } from '../../application/use-cases/get-user';

export function createServer(): FastifyInstance {
  const fastify = Fastify({ logger: true });
  const userRepository = new InMemoryUserRepository();
  const createUserUseCase = new CreateUser(userRepository);
  const getUserUseCase = new GetUser(userRepository);

  // Route pour créer un utilisateur
  fastify.post<{ Body: { id: string; name: string; email: string } }>('/users', async (request, reply) => {
    try {
      await createUserUseCase.execute(request.body);
      reply.status(201).send({ message: 'User created' });
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Route pour récupérer un utilisateur
  fastify.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    try {
      const user = await getUserUseCase.execute(request.params.id);
      if (!user) {
        reply.status(404).send({ error: 'User not found' });
      } else {
        reply.send({
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
        });
      }
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  return fastify;
}
