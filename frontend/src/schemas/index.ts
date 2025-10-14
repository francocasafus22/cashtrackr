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

  export const LoginSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "El email es obligatorio" })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Email no válido" }),
    password: z
      .string().min(1, {message: "El password es obligatorio"})
  })

export const JWTSchema = z.object({
  token: z.string({message: "Token no válido"})
})

export const SuccessSchema = z.object({
  message: z.string().min(1, { message: "Valor no valido" }),
});

export const ErrorSchema = z.object({
  error: z.string().min(1, { message: "Valor no valido" }),
})

export const TokenSchema = z.string({message: "Token no valido"}).length(6, {message: "Token no valido"})