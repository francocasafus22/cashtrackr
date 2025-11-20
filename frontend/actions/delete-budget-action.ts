"use server"

import getToken from "@/src/auth/token"
import { Budget, ErrorSchema, PasswordValidationSchema, SuccessSchema } from "@/src/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function deleteBudget(budgetId: Budget['id'],prevState: ActionStateType, formData: FormData){

    const result = PasswordValidationSchema.safeParse(formData.get('password'))

    if(!result.success){
        return{
            errors: result.error.issues.map(issue=>issue.message),
            success:""
        }
    }

    // Comprobar password

    const token = await getToken()
    const checkPasswordUrl = `${process.env.API_URL}/auth/check-password`
    const checkPasswordReq = await fetch(checkPasswordUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: result.data
        })
    })

    const checkPasswordJSON = await checkPasswordReq.json()

    if(!checkPasswordReq.ok){
        const {error} = ErrorSchema.parse(checkPasswordJSON)
        return {
            errors: [error],
            success:""
        }
    }


    // Eliminar Presupuesto

    const deleteBudgetUrl = `${process.env.API_URL}/budgets/${budgetId}`
    const deleteBudgetReq = await fetch(deleteBudgetUrl, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,        
        },
    })

    const deleteBudgetJSON = await deleteBudgetReq.json()

    if(!deleteBudgetReq.ok){
        const {error} = ErrorSchema.parse(deleteBudgetJSON);
        return{
            errors: [error],
            success: ""
        }
    }

    const {message} = SuccessSchema.parse(deleteBudgetJSON)

    return{
        errors: [],
        success: message
    }
}