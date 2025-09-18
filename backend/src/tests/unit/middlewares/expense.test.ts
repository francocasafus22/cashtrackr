import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { validateExpenseExist } from "../../../middlewares/expenses.middleware";
import { expenses } from "../../mocks/expenses";
import { hasAccess } from "../../../middlewares/budget.middleware";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Expense", () => ({
  findByPk: jest.fn(),
}));

describe("Expenses Middleware - validateExpenseExist", () => {
  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      const expense = expenses.filter((e) => e.id == id)[0] ?? null;

      return Promise.resolve(expense);
    });
  });

  it("should call next middleware if expense exist", async () => {
    const req = createRequest({
      params: {
        expenseId: expenses[0].id,
      },
    });

    const res = createResponse();

    const next = jest.fn();

    await validateExpenseExist(req, res, next);

    expect(Expense.findByPk).toHaveBeenCalled();
    expect(Expense.findByPk).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalled();
    expect(req.expense).toEqual(expenses[0]);
  });
  it("should handle internal server error", async () => {
    const req = createRequest({
      params: {
        expenseId: expenses[0].id,
      },
    });

    const res = createResponse();

    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());

    const next = jest.fn();

    await validateExpenseExist(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
  });
  it("should handle a non-existing budget", async () => {
    const req = createRequest({
      params: {
        expenseId: 120,
      },
    });

    const res = createResponse();

    const next = jest.fn();

    await validateExpenseExist(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: "Gasto no encontrado" });
  });

  it("should prevent unauthorized users from adding expenses", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      budget: budgets[0],
      user: { id: 2 },
      body: { name: "new expense's name", amount: 1000 },
    });

    const res = createResponse();
    const next = jest.fn();

    await hasAccess(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ error: "Acción no válida" });
    expect(next).not.toHaveBeenCalled();
  });
});
