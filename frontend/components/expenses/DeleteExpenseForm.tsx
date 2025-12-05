import { useParams } from "next/navigation";
import { DialogTitle } from "@headlessui/react";
import { useActionState, useEffect } from "react";
import deleteExpense from "@/actions/delete-expense-action";
import { Expense } from "@/src/schemas";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

export default function DeleteExpenseForm({
  expenseId,
  closeModal,
}: {
  expenseId: Expense["id"];
  closeModal: () => void;
}) {
  const { id: budgetId } = useParams();

  const deleteExpenseWithBudgetId = deleteExpense.bind(null, {
    budgetId: +budgetId!,
    expenseId: +expenseId,
  });

  const [state, dispatch, isPending] = useActionState(
    deleteExpenseWithBudgetId,
    {
      errors: [],
      success: "",
    },
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      closeModal();
    }
  }, [state, closeModal]);

  return (
    <>
      <DialogTitle as="h3" className="font-black text-4xl text-purple-950 ">
        Eliminar Gasto
      </DialogTitle>
      <p className="text-xl font-bold">
        Confirma para eliminar {""}
        <span className="text-amber-500">el gasto</span>
      </p>
      <p className="text-gray-600 text-sm">
        (Un gasto eliminado no se puede recuperar)
      </p>
      {state.errors.map((error) => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}
      <form className="grid grid-cols-2 gap-5 mt-5" action={dispatch}>
        <button
          className="bg-amber-500 w-full rounded-lg p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-red-500 w-full rounded-lg p-3 text-white uppercase font-bold hover:bg-red-600 cursor-pointer transition-colors"
        >
          {isPending ? <Spinner color="border-white" /> : "Eliminar"}
        </button>
      </form>
    </>
  );
}
