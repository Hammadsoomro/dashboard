import { RequestHandler } from "express";
import { getCollection } from "@/lib/mongo";

export const listDistributions: RequestHandler = async (req, res) => {
  try {
    const col = await getCollection("distributions");
    const rows = await col.find({}).sort({ createdAt: -1 }).toArray();
    res.json(rows);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createDistribution: RequestHandler = async (req, res) => {
  try {
    const { title, items = [], assignees = [], cadence = "once" } = req.body ?? {};
    if (!title) {
      res.status(400).json({ message: "title required" });
      return;
    }
    const col = await getCollection("distributions");
    const now = new Date().toISOString();
    const result = await col.insertOne({ title, items, assignees, cadence, createdAt: now });
    const created = await col.findOne({ _id: result.insertedId });
    res.json(created);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
