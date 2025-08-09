import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    res.json({ message: "Budgets obtenidos..." });
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
    const id = req.params.id;

    res.json({ message: `Budget ${id} obtenido...` });
  };

  static updateBudget = async (req: Request, res: Response) => {
    const updateData = req.body;
    res.json({ changes: updateData });
  };

  static deleteBudget = async (req: Request, res: Response) => {
    const id = req.params.id;
    res.json({ message: `Budget ${id} eliminado..` });
  };
}
