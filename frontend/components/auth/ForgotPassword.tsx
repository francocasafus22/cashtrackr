"use client";

import { forgotPassword } from "@/actions/forgot-password-action";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

export default function ForgotPasswordForm() {
  const [state, dispatch, isPending] = useActionState(forgotPassword, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.success) toast.info(state.success);
    else state.errors.map((error) => toast.error(error));
  }, [state]);

  return (
    <form className=" mt-14 space-y-5" noValidate action={dispatch}>
      <div className="flex flex-col gap-2 mb-10">
        <label className="font-bold text-2xl">Email</label>

        <input
          type="email"
          placeholder="Email de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer "
      >
        {isPending ? (
          <Spinner color="text-amber-500" />
        ) : (
          "Enviar Instrucciones"
        )}
      </button>
    </form>
  );
}
