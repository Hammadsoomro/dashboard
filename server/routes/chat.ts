import { RequestHandler } from "express";
import { getCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export const listConversations: RequestHandler = async (req, res) => {
  try {
    const convs = await getCollection("conversations");
    const rows = await convs.find({}).sort({ lastMessageAt: -1 }).toArray();
    res.json(rows);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await getCollection("messages");
    const convId = conversationId;
    const rows = await messages.find({ conversationId: convId }).sort({ sentAt: 1 }).toArray();
    res.json(rows);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const postMessage: RequestHandler = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { authorId, content } = req.body ?? {};
    if (!authorId || !content) {
      res.status(400).json({ message: "authorId and content required" });
      return;
    }
    const messages = await getCollection("messages");
    const convs = await getCollection("conversations");
    const now = new Date().toISOString();
    const result = await messages.insertOne({ conversationId, authorId, content, sentAt: now, status: "delivered" });

    await convs.updateOne({ _id: conversationId }, { $set: { lastMessageAt: now, lastMessagePreview: content } });

    const created = await messages.findOne({ _id: result.insertedId });
    res.json(created);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createConversation: RequestHandler = async (req, res) => {
  try {
    const { memberIds = [], title } = req.body ?? {};
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      res.status(400).json({ message: "memberIds required" });
      return;
    }
    const convs = await getCollection("conversations");
    const now = new Date().toISOString();
    const result = await convs.insertOne({ memberIds, title: title ?? null, lastMessageAt: now, lastMessagePreview: null, pinned: false });
    const created = await convs.findOne({ _id: result.insertedId });
    res.json(created);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
