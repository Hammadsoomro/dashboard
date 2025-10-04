import { MongoClient, Db, Collection } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectMongo() {
  if (cachedDb) return cachedDb;
  const uri = process.env.MONGODB_URI;
  console.log('connectMongo: MONGODB_URI present?', !!uri);
  if (!uri) throw new Error("MONGODB_URI_MISSING");

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  const dbName = process.env.MONGODB_DB_NAME ?? "app";
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

export async function getCollection<T = any>(name: string): Promise<Collection<T>> {
  const db = await connectMongo();
  return db.collection<T>(name);
}
