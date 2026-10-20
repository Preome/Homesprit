import { MongoClient } from 'mongodb';
import { INITIAL_PROPERTIES, INITIAL_INQUIRIES, INITIAL_AGENTS } from '../src/data/initialProperties.ts';

const MONGO_URI = process.env.DATABASE_URL || "mongodb+srv://tasdidanawaz_db_user:zTKxBe4Ti84gxoV0@cluster0.9yxdz1b.mongodb.net/homesprit?retryWrites=true&w=majority";

async function main() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db('homesprit');

  console.log('Clearing existing collections in homesprit database...');
  await db.collection('properties').deleteMany({});
  await db.collection('inquiries').deleteMany({});
  await db.collection('agents').deleteMany({});

  console.log(`Inserting ${INITIAL_PROPERTIES.length} properties...`);
  await db.collection('properties').insertMany(INITIAL_PROPERTIES as any);

  console.log(`Inserting ${INITIAL_INQUIRIES.length} inquiries...`);
  await db.collection('inquiries').insertMany(INITIAL_INQUIRIES as any);

  console.log(`Inserting ${INITIAL_AGENTS.length} agents...`);
  await db.collection('agents').insertMany(INITIAL_AGENTS as any);

  console.log('MongoDB Atlas database successfully seeded!');
  await client.close();
}

main().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
