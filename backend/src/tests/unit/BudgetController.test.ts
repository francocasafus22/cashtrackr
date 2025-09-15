import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budget";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";
import Expense from "../../models/Expense";

jest.mock("../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe("BudgetController.getAll", () => {
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(
        (budget) => budget.userId == options.where.userId
      );
      return Promise.resolve(updatedBudgets);
    });
  });

  it("should retrieve 2 budgets with user ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 },
    });

    const res = createResponse();

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(2);

    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("should retrieve 1 budget with user ID 2 ", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 2 },
    });

    const res = createResponse();

    const updatedBudgets = budgets.filter(
      (budget) => budget.userId == req.user.id
    );

    (Budget.findAll as jest.Mock).mockResolvedValue(updatedBudgets);

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);

    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(404);
  });

  it("should handle errors when fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 100 },
    });

    const res = createResponse();

    (Budget.findAll as jest.Mock).mockRejectedValue(new Error());
    await BudgetController.getAll(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
  });
});

describe("BudgetController.create", () => {
  it("should create a new budget and response with 201 status code", async () => {
    const mockBudget = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Budget.create as jest.Mock).mockResolvedValue(mockBudget);

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupuesto vacio", amount: 1000 },
    });

    const res = createResponse();
    await BudgetController.create(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(201);
    expect(data).toBe("Presupuesto creado correctamente");
    expect(mockBudget.save).toHaveBeenCalledTimes(1);
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });

  it("should handle create budget error", async () => {
    const mockBudget = {
      save: jest.fn(),
    };

    (Budget.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupuesto vacio", amount: 1000 },
    });

    const res = createResponse();

    await BudgetController.create(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(mockBudget.save).not.toHaveBeenCalled();
    expect(data).toEqual({ error: "Hubo un error" });
  });
});

describe("BudgetController.getOneByID", () => {
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockReset();
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.filter((b) => b.id == id)[0];
      return Promise.resolve(budget);
    });
  });

  it("should retrieve one budgets with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId",
      budget: { id: 1 },
    });

    const res = createResponse();

    await BudgetController.getOneByID(req, res);

    const data = res._getJSONData();

    expect(data.expenses).toHaveLength(3);
    expect(res.statusCode).toBe(200);
    expect(res.status).not.toBe(404);
    expect(Budget.findByPk).toHaveBeenCalledTimes(1);
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense],
    });
  });
});

describe("BudgetController.delete", () => {
  it("should delete a budget with Id 1", async () => {
    const budgetMock = {
      destroy: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId",
      budget: budgetMock,
    });

    const res = createResponse();

    await BudgetController.deleteBudget(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual({ message: "Presupuesto eliminado" });
    expect(budgetMock.destroy).toHaveBeenCalled();
    expect(budgetMock.destroy).toHaveBeenCalledTimes(1);
  });
});

describe("BudgetController.updateBudget", () => {
  it("should update the budget with Id 1", async () => {
    const budgetMock = {
      update: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId",
      budget: budgetMock,
      body: { name: "nuevo presupuesto", amount: 5000 },
    });

    const res = createResponse();

    await BudgetController.updateBudget(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(budgetMock.update).toHaveBeenCalled();
    expect(budgetMock.update).toHaveBeenCalledTimes(1);
    expect(budgetMock.update).toHaveBeenCalledWith(req.body);
    expect(data).toEqual({ message: "Presupuesto actualizado correctamente" });
  });
});
