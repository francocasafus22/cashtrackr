import { createRequest, createResponse } from "node-mocks-http";
import {
  hasAccess,
  validateBudgetExist,
} from "../../../middlewares/budget.middleware";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Budget", () => ({
  findByPk: jest.fn(),
}));

describe("budget - validateBudgetExist", () => {
  it("should handle non-existent budget", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(null);

    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });

    const res = createResponse();

    const next = jest.fn();

    await validateBudgetExist(req, res, next);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data).toEqual({ error: "Presupuesto no encontrado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should proceed to next middleware if budget exists", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });

    const res = createResponse();
    const next = jest.fn();
    await validateBudgetExist(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.budget).toEqual(budgets[0]);
  });

  it("should handle error", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      params: {
        budgetId: 1,
      },
    });

    const res = createResponse();

    const next = jest.fn();

    await validateBudgetExist(req, res, next);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("budget - hasAccess", () => {
  it("should proceed to next middleware if the acccess is successful", async () => {
    const req = createRequest({
      budget: budgets[0],
      user: { id: 1 },
    });

    const res = createResponse();
    const next = jest.fn();
    await hasAccess(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.budget).toBe(budgets[0]);
  });
  it("should return 401 error if userId doesn´t have access to budget", async () => {
    const req = createRequest({
      budget: budgets[0],
      user: { id: 2 },
    });

    const res = createResponse();
    const next = jest.fn();

    await hasAccess(req, res, next);
    const data = res._getJSONData();

    expect(next).not.toHaveBeenCalled();
    expect(data).toEqual({ erorr: "Acción no válida" });
    expect(res.statusCode).toBe(401);
  });
  it("should handle server error", async () => {
    const req = createRequest({
      budget: budgets[0],
      user: { id: 1 },
    });

    const res = createResponse();
    const next = jest.fn();

    Object.defineProperty(req, "budget", {
      get: () => {
        throw new Error();
      },
    });

    await hasAccess(req, res, next);

    const data = res._getJSONData();
    expect(data).toEqual({ error: "Hubo un error" });
    expect(res.statusCode).toBe(500);
    expect(next).not.toHaveBeenCalled();
  });
});
