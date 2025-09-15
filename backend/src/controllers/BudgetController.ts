import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        where: { userId: req.user.id },
      });

      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = await Budget.create(req.body);
      const { id } = req.user;

      budget.userId = id;

      await budget.save();

      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getOneByID = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense],
    });
    res.json(budget);
  };

  static updateBudget = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    res.json({ message: "Presupuesto actualizado correctamente" });
  };

  static deleteBudget = async (req: Request, res: Response) => {
    await req.budget.destroy();
    res.json({ message: "Presupuesto eliminado" });
  };
}
