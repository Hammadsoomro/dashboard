import { RequestHandler } from "express";
import { getCollection } from "../lib/mongo";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

// Helper to check if requesting user is admin
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

export const listTeam: RequestHandler = async (req, res) => {
  try {
    const users = await getCollection("users");
    // Only return members of the requesting user's team. requireAuth should have set req.userId
    const requesterId = req.userId;
    if (!requesterId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const requester = await users.findOne({ _id: (() => { try { return new ObjectId(requesterId); } catch { return requesterId; } })() });
    const teamId = requester?.teamId ?? String(requester?._id ?? requesterId);
    const docs = await users
      .find({ teamId }, { projection: { passwordHash: 0 } })
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
    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }
    const user = await users.findOne(query, { projection: { passwordHash: 0 } });
    if (!user) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(user);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createMember: RequestHandler = async (req, res) => {
  try {
    // Only admins can create members
    if (!(await isRequestingUserAdmin(req))) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const { name, email, role = "member", avatarUrl, location, status = "online", password } = req.body ?? {};
    if (!email || !name || !password) {
      res.status(400).json({ message: "name, email and password required" });
      return;
    }

    const users = await getCollection("users");
    const existing = await users.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const result = await users.insertOne({ name, email, role, avatarUrl: avatarUrl ?? null, location: location ?? null, status, passwordHash, createdAt: now });
    const user = await users.findOne({ _id: result.insertedId });
    const { passwordHash: _ph, ...rest } = user as any;
    res.json(rest);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const deleteMember: RequestHandler = async (req, res) => {
  try {
    if (!(await isRequestingUserAdmin(req))) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const { id } = req.params;
    const users = await getCollection("users");
    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }
    await users.deleteOne(query);
    res.json({ success: true });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
