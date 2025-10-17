"use server"

import { ErrorSchema, JWTSchema, LoginSchema, SuccessSchema } from "@/src/schemas";
import { cookies } from "next/headers";
import {redirect} from "next/navigation"

type ActionStateType = {
  errors: string[];
  success: string;
};

export async function authenticate(prevState: ActionStateType, formData: FormData) {
    const loginData= {
        email: formData.get("email"),
        password: formData.get("password")
    }

    // validacion

    const login = LoginSchema.safeParse(loginData)

    if(!login.success){
        const errors = login.error.issues.map(issue=>issue.message)
        return {errors, success: ""}
    }

    // Iniciar Sesión

    const url = `${process.env.API_URL}/auth/login`;
    
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: login.data.email,
          password: login.data.password
        }),
      });

    if(!req.ok){
        const error = ErrorSchema.parse(await req.json())
        return {
            errors: [error.error],
            success: ""
        }
    }

    const jwtMessage = JWTSchema.parse(await req.json());

  // Setear cookies
    const cookieStore = await cookies();
    cookieStore.set({
      name: "CASHTRACKR_TOKEN",
      value: jwtMessage.token,
      httpOnly: true,
      path:"/"
    })
    
    redirect("/admin")
}