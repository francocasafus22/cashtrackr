import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import {
  validateBudgetExist,
  validateBudgetId,
  validateBudgetInput,
} from "../middlewares/budget";

const router = Router();
router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExist);

router.get("/", BudgetController.getAll);

router.post(
  "/",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.createBudget
);

router.get("/:budgetId", BudgetController.getOneByID);

router.put(
  "/:budgetId",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateBudget
);

router.delete("/:budgetId", BudgetController.deleteBudget);

export default router;
