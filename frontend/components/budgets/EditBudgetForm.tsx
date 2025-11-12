"use client"

import { Budget } from "@/src/schemas"
import BudgetForm from "./BudgetForm"
import { editBudget } from "@/actions/edit-budget-action"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Spinner from "../ui/Spinner"

type EditBudgetProps = {
    id: number
}

export default function EditBudgetForm({budget}: {budget: Budget}) {

    const router = useRouter()

    const editBudgetWithId = editBudget.bind(null, budget.id)

    const [state, dispatch, isPending] = useActionState(editBudgetWithId, {
        errors: [],
        success: ''
    })

    useEffect(()=>{

        if(state.errors){
            state.errors.forEach(error=>toast.error(error))
        }
        if(state.success){
            toast.success(state.success, { autoClose: 2000})
            router.push("/admin")
        }

    }, [state])

    return (
        <form
            className=" space-y-3"
            noValidate
            action={dispatch}
        >
            <BudgetForm budget={budget}/>
            <button
                type="submit"
                className="bg-amber-500 w-full p-3 rounded-xl text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"        
            >
                {isPending ? <Spinner color="whites"/> : "Guardar Cambios"}
            </button>
        </form>
    )
}
