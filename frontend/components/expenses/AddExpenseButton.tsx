"use client"
import { ModalContext } from "@/providers/ModalProvider"
import { useRouter } from "next/navigation" 
import { useContext } from "react"
import AddExpenseForm from "./AddExpenseForm"

export default function AddExpenseButton(){

    const {openModal, closeModal} = useContext(ModalContext)

    return(
        <button
        type="button"
        className="bg-amber-500 px-10 py-2 rounded-lg text-white font-bold cursor-pointer"
        onClick={()=>openModal(<AddExpenseForm closeModal={closeModal}/>)}
        >
            Agregar Gasto
        </button>
    )
}