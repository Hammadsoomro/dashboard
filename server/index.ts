import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createLead, listLeads } from "./routes/mongo";

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

  // Leads (Mongo)
  app.get("/api/leads", listLeads);
  app.post("/api/leads", createLead);

  // Auth
  import("./routes/auth").then(({ register, login }) => {
    app.post("/api/auth/register", register);
    app.post("/api/auth/login", login);
  });

  // Team members
  import("./routes/team").then(({ listTeam, createMember, getMember }) => {
    app.get("/api/team", listTeam);
    app.post("/api/team", createMember);
    app.get("/api/team/:id", getMember);
  });

  // Chat
  import("./routes/chat").then(({ listConversations, getMessages, postMessage, createConversation }) => {
    app.get("/api/chat/conversations", listConversations);
    app.get("/api/chat/:conversationId/messages", getMessages);
    app.post("/api/chat/:conversationId/messages", postMessage);
    app.post("/api/chat/conversations", createConversation);
  });

  // Distribution
  import("./routes/distribution").then(({ listDistributions, createDistribution }) => {
    app.get("/api/distributions", listDistributions);
    app.post("/api/distributions", createDistribution);
  });

  return app;
}
