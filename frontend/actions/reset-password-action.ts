"use server"

import { ErrorSchema, ResetPasswordSchema, SuccessSchema } from "@/src/schemas"
import { json } from "zod"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function resetPassword (token:string, prevState: ActionStateType, formData: FormData) {
    
    const resetPasswordData = {
        password: formData.get("password"),
        password_confirmation: formData.get("password_confirmation")   
    }

    // Validación

    const resetPassword = ResetPasswordSchema.safeParse(resetPasswordData)

    if(!resetPassword.success){
        const errors = resetPassword.error.issues.map(issue=>issue.message)
        return {errors, success:""}
    }

    // Petición

    const url = `${process.env.API_URL}/auth/reset-password/${token}`;

    const req = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: resetPassword.data.password,            
        })
    })
    
    if(!req.ok){
        const {error} = ErrorSchema.parse(await req.json())
        return{
            errors: [error],
            success:""
        }
    }

    const success = SuccessSchema.safeParse(await req.json());
    if(!success.success){
        const errors = success.error.issues.map(issue=>issue.message)
        return{
            errors,
            success:""
        }
    }

    return{
        errors: [],
        success: success.data.message
    }
}