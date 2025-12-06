"use client";

import { resetPassword } from "@/actions/reset-password-action";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

type ResetPasswordProps = {
  token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordProps) {
  const router = useRouter();

  const resetPasswordWithToken = resetPassword.bind(null, token);

  const [state, dispatch, isPending] = useActionState(resetPasswordWithToken, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
    if (state.success) {
      toast.success(state.success);
      router.push("/auth/login");
    }
  }, [state, router]);

  return (
    <form className="mt-10 space-y-5" noValidate action={dispatch}>
      <div className="flex flex-col gap-5">
        <label className="font-bold text-2xl">Password</label>

        <input
          type="password"
          placeholder="Password de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
        />
      </div>

      <div className="flex flex-col gap-5">
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
        className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer block"
      >
        {isPending ? (
          <Spinner color="text-amber-500" />
        ) : (
          "Restablecer Contraseña"
        )}
      </button>
    </form>
  );
}
