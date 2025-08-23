import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        // TODO: filtrar por el usuario autenticado
      });
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static createBudget = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);

      await budget.save();
      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getOneByID = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (!budget) {
        const error = new Error("Presupuesto no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateBudget = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);
      if (!budget) {
        const error = new Error("Presupuesto no encontrado");
        return res.status(404).json({ error: error.message });
      }

      await budget.update(req.body);
      res.json({ message: "Presupuesto actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteBudget = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findByPk(id);

      if (!budget) {
        const error = new Error("Presupuesto no encontrado.");
        return res.status(404).json({ error: error.message });
      }

      await budget.destroy();
      res.json({ message: "Presupuesto eliminado" });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
