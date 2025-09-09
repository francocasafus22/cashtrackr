import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const validateUserExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  //Prevenir duplicados
  const userExist = await User.findOne({ where: { email } });
  if (userExist) {
    const error = new Error("El email ya está registrado");
    res.status(409).json({ error: error.message });
    return;
  }

  next();
};
