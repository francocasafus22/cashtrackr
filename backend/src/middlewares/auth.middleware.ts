import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("No estás autorizado");
    res.status(401).json({ error: error.message });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    const error = new Error("Token no válido");
    res.status(401).json({ error: error.message });
  }

  const decoded = verifyJWT(token);
  if (typeof decoded == "object" && decoded.id) {
    req.user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email"],
    });

    next();
  }

  try {
  } catch (error) {
    res.status(500).json({ error: "Token no válido" });
  }
};
