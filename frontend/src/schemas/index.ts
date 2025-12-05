import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "El email es obligatorio" })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Email no válido" }),
    name: z.string().min(1, { message: "Tu nombre no puede ir vacio" }),
    password: z
      .string()
      .min(8, { message: "EL password es muy corto, minimo 8 caracteres" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password == data.password_confirmation, {
    message: "Las constraseñas no son iguales",
    path: ["password_confirmation"],
  });

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El Email es obligatorio" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Email no válido" }),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es obligatorio" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Email no válido" }),
  password: z.string().min(1, { message: "El password es obligatorio" }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "EL password es muy corto, minimo 8 caracteres" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password == data.password_confirmation, {
    message: "Las contraseñas deben ser iguales",
    path: ["password_confirmation"],
  });

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});

export const ExpenseAPIResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  budgetId: z.number(),
});

export const DraftBudgetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre del presupuesto es obligatorio" }),
  amount: z.coerce
    .number({ message: "Cantidad no válida" })
    .min(1, { message: "Cantidad no válida" }),
});

export const PasswordValidationSchema = z
  .string()
  .min(1, { message: "Passwoord no válido" });

export const DraftExpenseSchema = z.object({
  name: z.string().min(1, { message: "El nombre del gasto es obligatorio" }),
  amount: z.coerce.number().min(1, { message: "Cantidad no válida" }),
});

export const BudgetAPIResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.string(),
  userId: z.number(),
  expenses: z.array(ExpenseAPIResponseSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BudgetsAPIResponseShcema = z.array(
  BudgetAPIResponseSchema.omit({ expenses: true }),
);

export const JWTSchema = z.object({
  token: z.string({ message: "Token no válido" }),
});

export const SuccessSchema = z.object({
  message: z.string().min(1, { message: "Valor no valido" }),
});

export const ErrorSchema = z.object({
  error: z.string().min(1, { message: "Valor no valido" }),
});

export const TokenSchema = z
  .string({ message: "Token no valido" })
  .length(6, { message: "Token no valido" });

export type User = z.infer<typeof UserSchema>;
export type Budget = z.infer<typeof BudgetAPIResponseSchema>;
export type Expense = z.infer<typeof ExpenseAPIResponseSchema>;
export type DraftExpense = z.infer<typeof DraftExpenseSchema>;
