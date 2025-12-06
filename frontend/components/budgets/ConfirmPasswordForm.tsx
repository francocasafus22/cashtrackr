import { DialogTitle } from "@headlessui/react";
import { useActionState, useEffect } from "react";
import { deleteBudget } from "@/actions/delete-budget-action";
import ErrorMessage from "../ui/ErrorMessage";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import { Budget } from "@/src/schemas";

export default function ConfirmPasswordForm({
  closeModal,
  budgetId,
}: {
  closeModal: () => void;
  budgetId: Budget["id"];
}) {
  const deleteBudgetWithPassword = deleteBudget.bind(null, +budgetId!);

  const [state, dispatch, isPending] = useActionState(
    deleteBudgetWithPassword,
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
      <DialogTitle as="h3" className="font-black text-4xl text-purple-950 mt-5">
        Eliminar Presupuesto
      </DialogTitle>

      <p className="text-gray-600 text-sm">
        (Un presupuesto eliminado y sus gastos no se pueden recuperar)
      </p>

      {state.errors.map((error) => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}

      <form className="mt-5  space-y-5" noValidate action={dispatch}>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl" htmlFor="password">
            Ingresa tu Password para eliminar{" "}
            <span className="text-amber-500">eliminar el presupuesto {""}</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <button
            className="bg-amber-500 hover:bg-amber-600 w-full p-3 rounded-lg text-white font-black cursor-pointer transition-colors"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black cursor-pointer transition-colors"
          >
            {isPending ? (
              <Spinner color="text-amber-500" />
            ) : (
              "Eliminar Presupuesto"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
