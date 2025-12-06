"use client";

import { register } from "@/actions/create-account-action";

import { useActionState, useEffect, useRef } from "react";
import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import Spinner from "../ui/Spinner";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const ref = useRef<HTMLFormElement>(null);

  const [state, dispatch, isPending] = useActionState(register, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    // Si el register es exitoso
    if (state.success) {
      // Resetea el formulario (ref => form)
      toast.info("Revisá el mail para confirmar tu cuenta");
      ref.current?.reset();
    }
  }, [state]);

  return (
    <form className="mt-14 space-y-5" noValidate action={dispatch} ref={ref}>
      {state.errors.map((error) => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}

      {state.success && <SuccessMessage>{state.success}</SuccessMessage>}

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Nombre</label>
        <input
          type="name"
          placeholder="Nombre de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Password</label>
        <input
          type="password"
          placeholder="Password de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Repetir Password</label>
        <input
          id="password_confirmation"
          type="password"
          placeholder="Repite Password de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="password_confirmation"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
      >
        {isPending ? <Spinner color="text-orange-400" /> : "Registrarme"}
      </button>
    </form>
  );
}
