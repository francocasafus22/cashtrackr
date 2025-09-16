import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpensesController";
import { expenses } from "../../mocks/expenses";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
  update: jest.fn(),
}));

describe("ExpenseController.create", () => {
  it("should create a new expense and return success message", async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Expense.create as jest.Mock).mockResolvedValue(expenseMock);

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "test expense", amount: 500 },
      budget: { id: 1 },
    });

    const res = createResponse();

    await ExpensesController.create(req, res);

    const data = res._getJSONData();

    expect(data).toEqual({ message: "Gasto creado correctamente" });
    expect(res.statusCode).toBe(201);
    expect(expenseMock.save).toHaveBeenCalled();
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });
  it("should handle expense creation error", async () => {
    const expenseMock = {
      save: jest.fn(),
    };

    (Expense.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      body: { name: "test expense", amount: 500 },
      budget: { id: 1 },
    });

    const res = createResponse();

    await ExpensesController.create(req, res);

    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
    expect(res.statusCode).toBe(500);
    expect(expenseMock.save).not.toHaveBeenCalled();
  });
});

describe("ExpenseController.getById", () => {
  it("should return expense and success message", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenses[0],
    });
    const res = createResponse();

    await ExpensesController.getById(req, res);
    expect(res._getJSONData()).toEqual(expenses[0]);
    expect(res.statusCode).toBe(200);
  });
});

describe("ExpenseController.updateById", () => {
  it("should update  expense and return status code 200", async () => {
    const expenseMock = {
      ...expenses[0],
      update: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
      body: { name: "new expense's name" },
    });

    const res = createResponse();

    await ExpensesController.updateById(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Gasto actualizado correctamente",
    });
    expect(expenseMock.update).toHaveBeenCalled();
    expect(expenseMock.update).toHaveBeenCalledTimes(1);
    expect(expenseMock.update).toHaveBeenCalledWith(req.body);
  });
  it("should handle error", async () => {
    const expenseMock = {
      ...expenses[0],
      update: jest.fn().mockRejectedValue(new Error()),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
      body: { name: "new expense's name" },
    });

    const res = createResponse();

    await ExpensesController.updateById(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
  });
});

describe("ExpenseController.deletById", () => {
  it("should delete budget and return success message", async () => {
    const expenseMock = {
      ...expenses[0],
      destroy: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
    });

    const res = createResponse();

    await ExpensesController.deleteById(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Gasto eliminado correctamente",
    });
    expect(expenseMock.destroy).toHaveBeenCalled();
    expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
  });
  it("should handle delete expense error and return status code 500", async () => {
    const expenseMock = {
      ...expenses[0],
      destroy: jest.fn().mockRejectedValue(new Error()),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
    });

    const res = createResponse();

    await ExpensesController.deleteById(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: "Hubo un error",
    });
  });
});
