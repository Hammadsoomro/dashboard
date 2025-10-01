import { RequestHandler } from "express";
import { MongoClient, Db, Collection } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let cachedCollection: Collection | null = null;

async function ensureMongo() {
  if (cachedCollection) return cachedCollection;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI_MISSING");

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  if (!cachedDb) {
    const dbName = process.env.MONGODB_DB_NAME ?? "app";
    cachedDb = cachedClient.db(dbName);
  }

  cachedCollection = cachedDb.collection("leads");
  return cachedCollection;
}

export const listLeads: RequestHandler = async (_req, res) => {
  try {
    const collection = await ensureMongo();

    const rows = await collection
      .find({}, { projection: { ref: 1, name: 1, company: 1, status: 1, source: 1, last_activity: 1 } })
      .sort({ last_activity: -1 })
      .limit(50)
      .toArray();

    res.json(rows);
  } catch (e: any) {
    if (e?.message === "MONGODB_URI_MISSING") {
      res
        .status(501)
        .json({ message: "MongoDB not configured. Set MONGODB_URI environment variable." });
      return;
    }

    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createLead: RequestHandler = async (req, res) => {
  try {
    const { ref, name, company, status, source } = req.body ?? {};
    const collection = await ensureMongo();

    const now = new Date().toISOString();
    const doc: any = { ref, name, company, status, source, last_activity: now };

    const result = await collection.insertOne(doc);

    const created = await collection.findOne({ _id: result.insertedId });
    res.json(created);
  } catch (e: any) {
    if (e?.message === "MONGODB_URI_MISSING") {
      res
        .status(501)
        .json({ message: "MongoDB not configured. Set MONGODB_URI environment variable." });
      return;
    }

    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
