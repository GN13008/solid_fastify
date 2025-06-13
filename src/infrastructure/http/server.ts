import Fastify, { FastifyInstance } from 'fastify';
import { CreateUser } from '../../application/use-cases/create-user';
import { GetUser } from '../../application/use-cases/get-user';
import mongodb from '@fastify/mongodb';
import { MongoUserRepository } from '../persistence/mongo-user-repository';

export function createServer(): FastifyInstance {
  const fastify = Fastify({ logger: true });

  fastify.register(mongodb, {
    forceClose: true,                       // ferme proprement à shutdown
    url: process.env.MONGO_URI ?? 'mongodb://localhost:27017/solid_fastify',
    database: 'solid_fastify',              // optionnel ; sinon useDb plus tard
  });

  fastify.after(() => {
    const userRepository = new MongoUserRepository(fastify);
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
  });


  return fastify;
}
