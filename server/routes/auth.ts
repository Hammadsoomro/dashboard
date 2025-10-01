import { RequestHandler } from "express";
import { getCollection } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role = "member", avatarUrl, location } =
      req.body ?? {};

    if (!email || !password || !name) {
      res.status(400).json({ message: "name, email and password are required" });
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
    const result = await users.insertOne({
      name,
      email,
      passwordHash,
      role,
      avatarUrl: avatarUrl ?? null,
      location: location ?? null,
      status: "online",
      createdAt: now,
    });

    const user = await users.findOne({ _id: result.insertedId });

    const token = jwt.sign({ userId: String(result.insertedId), email }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ token, user: { ...user, passwordHash: undefined } });
  } catch (e: any) {
    console.error(e);
    if (e?.message === "MONGODB_URI_MISSING") {
      res.status(501).json({ message: "MongoDB not configured. Set MONGODB_URI." });
      return;
    }
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const users = await getCollection("users");
    const user = await users.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: String(user._id), email }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ token, user: { ...user, passwordHash: undefined } });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
