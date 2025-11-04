"use client"

import { createBudget } from "@/actions/create-budget-action"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"
import Spinner from "../ui/Spinner"
import { useRouter } from "next/navigation"

export default function CreateBudgetForm() {

  const [state, dispatch, isPending] = useActionState(createBudget, {
    errors: [],
    success: ""
  })

  const router = useRouter();

  useEffect(()=>{
    state.success ? 
      toast.success(state.success, {
        autoClose: 2500,
        onClose: ()=>router.push("/admin"),
        onClick: ()=>router.push("/admin"),
      }) : state.errors.map(error=>toast.error(error))
      
  }, [state])

  return (
    <form
      className=" space-y-3"
      noValidate
      action={dispatch}
    >
      <div className="space-y-3">
          <label htmlFor="name" className="text-sm uppercase font-bold">
              Nombre Presupuesto
          </label>
          <input
              id="name"
              className="w-full p-3  border border-gray-100 bg-slate-100"
              type="text"
              placeholder="Nombre del Presupuesto"
              name="name"
          />
      </div>
      <div className="space-y-3">
          <label htmlFor="amount" className="text-sm uppercase font-bold">
              Cantidad Presupuesto
          </label>
          <input
              type="number"
              id="amount"
              className="w-full p-3  border border-gray-100 bg-slate-100"
              placeholder="Cantidad Presupuesto"
              name="amount"
          />
      </div>
      <button
        type="submit"
        className="bg-amber-500 w-full p-3 rounded-xl text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"        
      >{isPending ? <Spinner color="text-white"/> : 'Crear Presupuesto'}</button>
    </form>
  )
}