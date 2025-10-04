import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth: RequestHandler = (req: any, res, next) => {
  const auth = req.headers.authorization as string | undefined;
  if (!auth) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Invalid Authorization format" });
    return;
  }

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET) as any;
    req.userId = payload.userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
