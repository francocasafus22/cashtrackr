"use client";

import { createBudget } from "@/actions/create-budget-action";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import { useRouter } from "next/navigation";
import BudgetForm from "./BudgetForm";

export default function CreateBudgetForm() {
  const [state, dispatch, isPending] = useActionState(createBudget, {
    errors: [],
    success: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.success, {
        autoClose: 2000,
      });
      router.push("/admin");
    } else {
      state.errors.map((error) => toast.error(error));
    }
  }, [state, router]);

  return (
    <form className=" space-y-3" noValidate action={dispatch}>
      <BudgetForm />
      <button
        type="submit"
        className="bg-amber-500 w-full p-3 rounded-xl text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
      >
        {isPending ? <Spinner color="text-white" /> : "Crear Presupuesto"}
      </button>
    </form>
  );
}
