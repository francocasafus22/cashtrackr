import { DraftExpense, Expense } from "@/src/schemas";
import { DialogTitle } from "@headlessui/react";
import ExpenseForm from "./ExpenseForm";
import { useActionState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import editExpense from "@/actions/edit-expense-action";
import ErrorMessage from "../ui/ErrorMessage";
import { toast } from "react-toastify";

export default function EditExpenseForm({
  expenseId,
  closeModal,
}: {
  expenseId: Expense["id"];
  closeModal: () => void;
}) {
  const { id: budgetId } = useParams();
  const queryClient = useQueryClient();

  const editExpenseWithBudgetId = editExpense.bind(null, {
    budgetId: +budgetId!,
    expenseId: +expenseId,
  });
  const [state, dispatch] = useActionState(editExpenseWithBudgetId, {
    errors: [],
    success: "",
  });

  const { data: expense } = useQuery<DraftExpense>({
    queryKey: ["expense", budgetId, expenseId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/admin/api/budgets/${budgetId}/expenses/${expenseId}`,
      );
      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      queryClient.removeQueries({
        queryKey: ["expense", budgetId, expenseId],
      });
      closeModal();
    }
  }, [state, closeModal, budgetId, expenseId, queryClient]);

  return (
    <>
      <DialogTitle as="h3" className="font-black text-4xl text-purple-950 my-5">
        Editar Gasto
      </DialogTitle>
      <p className="text-xl font-bold">
        Edita los detalles de un {""}
        <span className="text-amber-500">gasto</span>
      </p>
      {state.errors.map((error) => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}
      <form
        className="bg-gray-100 shadow-lg rounded-lg p-10 mt-5 border border-gray-300"
        noValidate
        action={dispatch}
      >
        <ExpenseForm expense={expense} />

        <input
          type="submit"
          className="bg-amber-500 w-full rounded-lg p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
          value="Guardar Cambios"
        />
      </form>
    </>
  );
}
