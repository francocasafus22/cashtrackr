import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middlewares/validation";
import { validateUserExist } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create-account",

  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, mínimo 8 caracteres."),
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  validateUserExist,
  AuthController.createAccount
);

export default router;
