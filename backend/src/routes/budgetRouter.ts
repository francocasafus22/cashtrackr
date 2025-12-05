import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import {
  validateBudgetExist,
  validateBudgetId,
  validateBudgetInput,
  hasAccess,
} from "../middlewares/budget.middleware";
import { ExpensesController } from "../controllers/ExpensesController";
import {
  belongsToBudget,
  validateExpenseExist,
  validateExpenseId,
  validateExpenseInput,
} from "../middlewares/expenses.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExist);
router.param("budgetId", hasAccess);
router.param("expenseId", validateExpenseId);
router.param("expenseId", validateExpenseExist);
router.param("expenseId", belongsToBudget);

router.get("/", BudgetController.getAll);

router.post(
  "/",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create,
);

router.get("/:budgetId", BudgetController.getOneByID);

router.put(
  "/:budgetId",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateBudget,
);

router.delete("/:budgetId", BudgetController.deleteBudget);

/** Routes for expenses */
// Patrón ROA (Patrón Orientado a Recursos) /api/budgets/10/exprenses/2

router.get(
  "/:budgetId/expenses/:expenseId",
  validateExpenseId,
  validateExpenseExist,
  ExpensesController.getById,
);
router.post(
  "/:budgetId/expenses",
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.create,
);
router.delete("/:budgetId/expenses/:expenseId", ExpensesController.deleteById);
router.put("/:budgetId/expenses/:expenseId", ExpensesController.updateById);

export default router;
