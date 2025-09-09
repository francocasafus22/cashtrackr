import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middlewares/validation";
import { limiter } from "../config/limiter";

const router = Router();
router.use(limiter);

router.post(
  "/create-account",

  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, mínimo 8 caracteres."),
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,

  AuthController.createAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email no válido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/confirm-account",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,

  AuthController.confirmAccount
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.validateToken
);

export default router;
