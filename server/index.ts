import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createLead, listLeads } from "./routes/mongo";
import { register, login, me } from "./routes/auth";
import { requireAuth } from "./middleware/auth";
import { listTeam, createMember, getMember, deleteMember } from "./routes/team";
import { listConversations, getMessages, postMessage, createConversation } from "./routes/chat";
import { listDistributions, createDistribution } from "./routes/distribution";
import { listSales, getSalesForUser, upsertSales } from "./routes/sales";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Debug route to inspect important env vars
  app.get('/api/debug/env', (_req, res) => {
    res.json({
      hasMongo: !!process.env.MONGODB_URI,
      mongo: process.env.MONGODB_URI ? '[redacted]' : null,
      jwt: !!process.env.JWT_SECRET,
    });
  });

  // Leads (Mongo)
  app.get("/api/leads", listLeads);
  app.post("/api/leads", createLead);

  // Auth
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", requireAuth, me);

  // Team members
  app.get("/api/team", listTeam);
  app.post("/api/team", requireAuth, createMember);
  app.get("/api/team/:id", getMember);
  app.delete("/api/team/:id", requireAuth, deleteMember);

  // Chat
  app.get("/api/chat/conversations", listConversations);
  app.get("/api/chat/:conversationId/messages", getMessages);
  app.post("/api/chat/:conversationId/messages", postMessage);
  app.post("/api/chat/conversations", createConversation);

  // Distribution
  app.get("/api/distributions", listDistributions);
  app.post("/api/distributions", createDistribution);

  // Sales
  app.get('/api/sales', listSales);
  app.get('/api/sales/:userId', getSalesForUser);
  app.post('/api/sales/:userId', requireAuth, upsertSales);

  return app;
}
