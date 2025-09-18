import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      //Prevenir duplicados
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        const error = new Error("El email ya está registrado");
        res.status(409).json({ error: error.message });
        return;
      }

      const user = await User.create(req.body);
      user.password = await hashPassword(req.body.password);
      user.token = generateToken();
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.status(201).json({ message: "Cuenta creada correctamente" });
    } catch (error) {
      // console.log(error.message);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const user = await User.findOne({ where: { token } });

      if (!user) {
        const error = new Error("Token no válido");
        res.status(401).json({ error: error.message });
        return;
      }

      user.confirmed = true;
      user.token = null;
      await user.save();

      res.json({ message: "Cuenta confirmada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if (!user.confirmed) {
        const error = new Error("La cuenta no ha sido confirmada");
        res.status(403).json({ error: error.message });
        return;
      }

      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("Contraseña incorrecta");
        res.status(401).json({ error: error.message });
        return;
      }

      const token = generateJWT(user.id);

      res.json(token);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({ error: error.message });
        return;
      }

      user.token = generateToken();
      await user.save();

      await AuthEmail.sendPasswordResetToken({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.json({ message: "Revisa tu email para restablecer tu contraseña" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await User.findOne({ where: { token } });

      if (!tokenExist) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      res.json("token valido");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({ where: { token } });

      if (!user) {
        const error = new Error("Token no válido");
        res.status(404).json({ error: error.message });
        return;
      }

      user.password = await hashPassword(password);
      user.token = null;
      await user.save();

      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateCurrentPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const { id } = req.user;

    try {
      const user = await User.findByPk(id, { attributes: ["id", "password"] });

      const isCorrect = await checkPassword(current_password, user.password);

      if (!isCorrect) {
        const error = new Error("La contraseña actual es incorrecta");
        res.status(401).json({ error: error.message });
        return;
      }

      const newHash = await hashPassword(password);

      await user.update({ password: newHash });

      res.json({ message: "Contraseña modificada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static checkPassword = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const { id } = req.user;

      const user = await User.findByPk(id, { attributes: ["password"] });

      const isCorrect = await checkPassword(password, user.password);

      if (!isCorrect) {
        const error = new Error("La contraseña es incorrecta");
        res.status(401).json({ error: error.message });
        return;
      }

      res.json({ message: "La contraseña es correcta" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
