import AddExpenseButton from "@/components/expenses/AddExpenseButton"
import ModalContainer from "@/components/ui/ModalContainer"
import { getBudget } from "@/src/services/budgets"
import { Metadata } from "next"

export async function generateMetadata({params} : {params: {id: string}}) : Promise<Metadata> {
    const {id} = await params
    const budget = await getBudget(id)
    
    return{
        title: `CashTrackr - ${budget.name}`,
        description: `CashTrackr - ${budget.name}`
    }
}

export default async function BudgetDetailsPage({params} : {params: {id: string}}){

    const {id} = await params
    const budget = await getBudget(id)

    return(
        <>
        
            <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
                <div>
                    <h1 className="font-black text-4xl text-purple-900">
                        {budget.name}
                    </h1>
                    <p className="text-xl font-bold">
                        Administra tus {''} <span className="text-amber-500">gastos</span>
                    </p>
                </div>
                <AddExpenseButton/>
            </div>
        
            <ModalContainer/>
        </>
    )
}