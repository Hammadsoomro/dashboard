import { RequestHandler } from "express";
import { getCollection } from "../lib/mongo";

import { ObjectId } from "mongodb";

export const listDistributions: RequestHandler = async (req, res) => {
  try {
    const col = await getCollection("distributions");
    const users = await getCollection('users');
    const requesterId = req.userId;
    if (!requesterId) { res.status(401).json({ message: 'Not authenticated' }); return; }
    const requester = await users.findOne({ _id: (() => { try { return new ObjectId(requesterId); } catch { return requesterId; } })() });
    // super-admin sees all
    if (requester && (requester.role === 'super-admin' || requester.role === 'Super-Admin')) {
      const rows = await col.find({}).sort({ createdAt: -1 }).toArray();
      res.json(rows);
      return;
    }

    const teamId = requester?.teamId ?? String(requester?._id ?? requesterId);
    const rows = await col.find({ teamId }).sort({ createdAt: -1 }).toArray();
    res.json(rows);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createDistribution: RequestHandler = async (req, res) => {
  try {
    const users = await getCollection('users');
    const requesterId = req.userId;
    if (!requesterId) { res.status(401).json({ message: 'Not authenticated' }); return; }
    const requester = await users.findOne({ _id: (() => { try { return new ObjectId(requesterId); } catch { return requesterId; } })() });
    if (!requester || !(requester.role === 'admin' || requester.role === 'Admin' || requester.role === 'super-admin' || requester.role === 'Super-Admin')) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const { title, items = [], assignees = [], cadence = "once", intervalSeconds = 1 } = req.body ?? {};
    if (!title) { res.status(400).json({ message: 'title required' }); return; }

    // ensure assignees belong to requester's team
    const teamId = requester?.teamId ?? String(requester?._id ?? requesterId);
    const validAssignees = [] as string[];
    for (const a of assignees) {
      const u = await users.findOne({ _id: (() => { try { return new ObjectId(a); } catch { return a; } })() });
      if (u && String(u.teamId) === String(teamId)) validAssignees.push(a);
    }

    // simple assignment algorithm: round-robin chunks per assignee
    const lines: any[] = Array.isArray(items) ? items : [];
    const assignments: any[] = validAssignees.map((id) => ({ memberId: id, lines: [] }));
    let ptr = 0;
    const linesPerMember = Number(req.body.linesPerMember) || 1;
    while (ptr < lines.length) {
      for (const a of assignments) {
        if (ptr >= lines.length) break;
        const chunk = lines.slice(ptr, ptr + linesPerMember);
        ptr += chunk.length;
        if (chunk.length) a.lines = a.lines.concat(chunk);
      }
    }
    const now = new Date().toISOString();
    const col = await getCollection('distributions');
    const createdDoc = { title, items: lines, assignments, cadence, intervalSeconds, teamId, createdAt: now };
    const r = await col.insertOne(createdDoc);
    const created = await col.findOne({ _id: r.insertedId });

    // Optionally: create a conversation or message entries for each assignee so inbox shows notification
    const convs = await getCollection('conversations');
    for (const a of assignments) {
      // create a dedicated distribution conversation id or link - here we store distribution reference only
      // leave creation of messages to clients polling /api/distributions
    }

    res.json(created);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
};
