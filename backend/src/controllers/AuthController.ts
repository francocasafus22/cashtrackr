import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassworrd } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body);
      user.password = await hashPassworrd(req.body.password);
      user.token = generateToken();
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.json("Cuenta creada correctamente");
    } catch (error) {
      // console.log(error.message);
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
