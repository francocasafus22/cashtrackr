import type { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

declare global {
  namespace Express {
    interface Request {
      budget: Budget;
    }
  }
}

export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("budgetId")
    .isInt()
    .withMessage("ID no válido")
    .custom((value) => value > 0)
    .withMessage("ID no válido")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateBudgetExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId, {
      include: [Expense],
    });
    if (!budget) {
      const error = new Error("Presupuesto no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const hasAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;
    const budget = req.budget;

    if (budget.userId !== id) {
      const error = new Error("Presupuesto no encontrado");
      res.status(404).json({ erorr: error.message });
      return;
    }

    req.budget = budget;

    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del presupuesto es obligatorio")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isNumeric()
    .withMessage("Cantidad no valida")
    .custom((value) => value > 0)
    .withMessage("La cantidad debe ser mayor a 0.")
    .run(req);

  next();
};
