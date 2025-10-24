"use server"

import { ErrorSchema, SuccessSchema, TokenSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function validateToken(token: string, prevState: ActionStateType) {

    const resetPasswordToken = TokenSchema.safeParse(token)
    if(!resetPasswordToken.success){
        return{
            errors: resetPasswordToken.error.issues.map(issue=>issue.message),
            success: ""
        }
    }

    const url = `${process.env.API_URL}/auth/validate-token`

    const req = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:  JSON.stringify({
            token: resetPasswordToken.data
        })
    })

    const json = await req.json();

    if(!req.ok){
        const {error} = ErrorSchema.parse(json)
        return{
            errors: [error],
            success: ""
        }
    }

    const success = SuccessSchema.safeParse(json)

    if(!success.success){
        const errors = success.error.issues.map(issue=>issue.message)
        return{
            errors,
            success: ""
        }
    }

    return{
        errors:[],
        success: success.data.message
    }
}