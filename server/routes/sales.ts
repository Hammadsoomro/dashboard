import { RequestHandler } from "express";
import { getCollection } from "../lib/mongo";
import { ObjectId } from "mongodb";

async function isRequestingUserAdmin(req: any) {
  const userId = req.userId;
  if (!userId) return false;
  const users = await getCollection("users");
  try {
    const owner = await users.findOne({ _id: new ObjectId(userId) });
    return !!owner && (owner.role === "admin" || owner.role === "Admin");
  } catch (e) {
    const owner = await users.findOne({ _id: userId });
    return !!owner && (owner.role === "admin" || owner.role === "Admin");
  }
}

export const listSales: RequestHandler = async (_req, res) => {
  try {
    const sales = await getCollection("sales");
    const rows = await sales.find({}).toArray();
    res.json(rows);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const getSalesForUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const sales = await getCollection("sales");
    const row = await sales.findOne({ userId });
    if (!row) {
      // return defaults
      res.json({ userId, today: 0, weekly: 0, monthly: 0, tier: 'silver' });
      return;
    }
    res.json(row);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const upsertSales: RequestHandler = async (req, res) => {
  try {
    if (!(await isRequestingUserAdmin(req))) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const { userId } = req.params;
    const { today = 0, weekly = 0, monthly = 0, tier = 'silver' } = req.body ?? {};
    const sales = await getCollection("sales");
    const now = new Date().toISOString();

    const result = await sales.findOneAndUpdate(
      { userId },
      { $set: { userId, today, weekly, monthly, tier, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true, returnDocument: 'after' as any },
    );

    res.json(result.value);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
