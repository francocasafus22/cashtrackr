"use server"

import { ErrorSchema, ForgotPasswordSchema, SuccessSchema } from "@/src/schemas"
import { redirect } from "next/navigation"
import { success } from "zod"

type ActionStateType = {
    errors: string[],
    success: string

}

export async function forgotPassword(prevState: ActionStateType, formData: FormData){

    const forgotPasswordData = {
        email: formData.get("email")
    }

    // Validación

    const forgotPassword = ForgotPasswordSchema.safeParse(forgotPasswordData)

    if(!forgotPassword.success){
        const errors = forgotPassword.error.issues.map(issue => issue.message)
        return{
            errors, success:""
        }
    }

    // Petición

    const url = `${process.env.API_URL}/auth/forgot-password`;

    const req = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: forgotPassword.data.email
        })
    })

    if(!req.ok){
        const error = ErrorSchema.parse(await req.json());
        return {
            errors: [error.error],
            success: ""
        }
    }

    const success = SuccessSchema.safeParse(await req.json())

    if(!success.success){
        const errors = success.error.issues.map(issue=>issue.message)
        return {errors, success: ""}
    }

    return{
        errors: [],
        success: success.data.message
    }
}