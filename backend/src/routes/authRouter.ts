import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middlewares/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middlewares/auth.middleware";

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
  body("token").isLength({ min: 6, max: 6 }).withMessage("Token no válido"),
  handleInputErrors,

  AuthController.confirmAccount
);

// Envia el mail con el token, para cambiar la contraseña olvidada
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Email no válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

// Valida el token recibido al mail
router.post(
  "/validate-token",
  body("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.validateToken
);

// Cambia la contraseña con el token validado
router.post(
  "/reset-password/:token",

  param("token")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, mínimo 8 caracteres."),
  handleInputErrors,
  AuthController.resetPasswordWithToken
);

// Cambia la contraseña actual ya sabiendola
router.post(
  "/update-password",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("Debe ingresar su contraseña actual"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña es muy corta, mínimo 8 caracteres.")
    .custom((value, { req }) => value !== req.body.current_password)
    .withMessage("La nueva contraseña debe ser diferente a la actual."),
  handleInputErrors,
  AuthController.updateCurrentPassword
);

router.get(
  "/user",
  authenticate,

  AuthController.user
);

router.post(
  "/check-password",
  authenticate,
  body("password").notEmpty().withMessage("Debe su contraseña"),
  handleInputErrors,
  AuthController.checkPassword
);

export default router;
