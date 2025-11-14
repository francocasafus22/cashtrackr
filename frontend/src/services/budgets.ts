import { cache } from "react"
import getToken from "../auth/token"
import { notFound } from "next/navigation"
import { BudgetAPIResponseSchema } from "../schemas"

export const getBudget =  cache(async (id: string) => {

    const token = await getToken()
    const url = `${process.env.API_URL}/budgets/${id}`
    const req = await fetch(url, {
        headers:{
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()

    if(!req.ok){
        notFound()
    }

    const budget = BudgetAPIResponseSchema.parse(json)

    return budget

})