"use client";

import { updatePassword } from "@/actions/update-password-action";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ErrorMessage from "../ui/ErrorMessage";
import Spinner from "../ui/Spinner";

export default function ChangePasswordForm() {
  const ref = useRef<HTMLFormElement>(null);

  const [state, dispatch, isPending] = useActionState(updatePassword, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      ref.current?.reset();
    }
  }, [state]);

  return (
    <>
      {state.errors &&
        state.errors.map((error) => (
          <ErrorMessage key={error}>{error}</ErrorMessage>
        ))}
      <form className="mt-10  space-y-5" noValidate action={dispatch} ref={ref}>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl" htmlFor="current_password">
            Password Actual
          </label>
          <input
            id="current_password"
            type="password"
            placeholder="Password Actual"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="current_password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl" htmlFor="password">
            Nuevo Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label htmlFor="password_confirmation" className="font-bold text-2xl">
            Repetir Password
          </label>

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
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        >
          {isPending ? (
            <Spinner color="border-amber-500" />
          ) : (
            "Cambiar Password"
          )}
        </button>
      </form>
    </>
  );
}
