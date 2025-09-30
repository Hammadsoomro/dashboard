import { RequestHandler } from "express";

const ensureNeon = async () => {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("NEON_URL_MISSING");
  // Lazy import to avoid requiring package if not connected
  const { neon } = await import("@neondatabase/serverless").catch(() => ({
    neon: null as any,
  }));
  if (!neon) throw new Error("NEON_DRIVER_MISSING");
  return neon(url);
};

export const listLeads: RequestHandler = async (_req, res) => {
  try {
    const sql = await ensureNeon();
    const rows =
      await sql`select id, ref, name, company, status, source, last_activity from leads order by last_activity desc limit 50`;
    res.json(rows);
  } catch (e: any) {
    if (
      e?.message === "NEON_URL_MISSING" ||
      e?.message === "NEON_DRIVER_MISSING"
    ) {
      res
        .status(501)
        .json({
          message:
            "Neon not configured. Connect Neon MCP and set NEON_DATABASE_URL.",
        });
      return;
    }
    res.status(500).json({ message: "Unexpected error" });
  }
};

export const createLead: RequestHandler = async (req, res) => {
  try {
    const { ref, name, company, status, source } = req.body ?? {};
    const sql = await ensureNeon();
    const rows =
      await sql`insert into leads (ref, name, company, status, source) values (${ref}, ${name}, ${company}, ${status}, ${source}) returning *`;
    res.json(rows[0]);
  } catch (e: any) {
    if (
      e?.message === "NEON_URL_MISSING" ||
      e?.message === "NEON_DRIVER_MISSING"
    ) {
      res
        .status(501)
        .json({
          message:
            "Neon not configured. Connect Neon MCP and set NEON_DATABASE_URL.",
        });
      return;
    }
    res.status(500).json({ message: "Unexpected error" });
  }
};
