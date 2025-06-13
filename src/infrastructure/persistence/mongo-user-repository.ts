import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';
import { FastifyInstance } from 'fastify';
import { Db, ObjectId } from 'mongodb';

export class MongoUserRepository implements UserRepository {
  private db: Db;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.mongo.db!; // non-null assertion as plugin guarantees db
    // ensure unique index on email
    this.db.collection('users').createIndex({ email: 1 }, { unique: true }).catch(() => {/* ignore if exists */});
  }
    
  async save(user: User): Promise<void> {
    await this.db.collection('users').updateOne(
      { _id: new ObjectId(user.getId()) },
      { $set: { name: user.getName(), email: user.getEmail() } },
      { upsert: true },
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.db.collection('users').findOne({ email });
    return doc ? User.create(doc._id.toString(), doc.name, doc.email) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.db.collection('users').findOne({ _id: new ObjectId(id) });
    return doc ? User.create(doc._id.toString(), doc.name, doc.email) : null;
  }
}