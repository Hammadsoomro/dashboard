import { RequestHandler } from "express";
import { getCollection } from "@/lib/mongo";

export const listTeam: RequestHandler = async (req, res) => {
  try {
    const users = await getCollection("users");
    const docs = await users
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(docs);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const getMember: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await getCollection("users");
    const user = await users.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const { passwordHash, ...rest } = user as any;
    res.json(rest);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createMember: RequestHandler = async (req, res) => {
  try {
    const { name, email, role = "member", avatarUrl, location, status = "online" } = req.body ?? {};
    if (!email || !name) {
      res.status(400).json({ message: "name and email required" });
      return;
    }

    const users = await getCollection("users");
    const existing = await users.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const now = new Date().toISOString();
    const result = await users.insertOne({ name, email, role, avatarUrl: avatarUrl ?? null, location: location ?? null, status, createdAt: now });
    const user = await users.findOne({ _id: result.insertedId });
    const { passwordHash, ...rest } = user as any;
    res.json(rest);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
