import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";

const router = Router();

router.get("/", BudgetController.getAll);

router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("El nombre del presupuesto es obligatorio"),
  body("amount")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isNumeric()
    .withMessage("Cantidad no valida")
    .custom((value) => value > 0)
    .withMessage("La cantidad debe ser mayor a 0."),
  handleInputErrors,
  BudgetController.createBudget
);

router.get(
  "/:id",
  param("id")
    .isInt()
    .withMessage("ID no válido")
    .custom((value) => value > 0)
    .withMessage("ID no válido"),
  handleInputErrors,
  BudgetController.getOneByID
);

router.put(
  "/:id",
  param("id")
    .isInt()
    .withMessage("ID no válido")
    .custom((value) => value > 0)
    .withMessage("ID no válido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre del presupuesto es obligatorio"),
  body("amount")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isNumeric()
    .withMessage("Cantidad no valida")
    .custom((value) => value > 0)
    .withMessage("La cantidad debe ser mayor a 0."),
  handleInputErrors,
  BudgetController.updateBudget
);

router.delete(
  "/:id",
  param("id")
    .isInt()
    .withMessage("ID no válido")
    .custom((value) => value > 0)
    .withMessage("ID no válido"),
  handleInputErrors,
  BudgetController.deleteBudget
);

export default router;
