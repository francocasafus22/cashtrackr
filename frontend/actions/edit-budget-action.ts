"use server"

import getToken from "@/src/auth/token"
import { DraftBudgetSchema, ErrorSchema, SuccessSchema } from "@/src/schemas"
import { revalidatePath, revalidateTag } from "next/cache"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function editBudget (id: number, prevState: ActionStateType, formData: FormData){

    const budget = DraftBudgetSchema.safeParse({
        name: formData.get("name"),
        amount: formData.get("amount")
    })

    if(!budget.success){
        return{
            errors: budget.error.issues.map(issue=>issue.message),
            success:""
        }
    }

    const token = await getToken()

    const url = `${process.env.API_URL}/budgets/${id}`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: budget.data.name,
            amount: budget.data.amount
        })
    })

    const json = await req.json()

    if(!req.ok){
        const error = ErrorSchema.parse(json)
        return{
            errors: [error.error],
            success: ''
        }
    }

    revalidateTag("/all-budgets")

    const success = SuccessSchema.parse(json).message

    return{
        errors: [],
        success
    }

}