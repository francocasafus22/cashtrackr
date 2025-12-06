"use client";

import editUser from "@/actions/edit-user-action";
import { useActionState, useEffect } from "react";
import Spinner from "../ui/Spinner";
import { toast } from "react-toastify";
import ErrorMessage from "../ui/ErrorMessage";
import { User } from "@/src/schemas";

export default function ProfileForm({ user }: { user: User }) {
  const [state, dispatch, isPending] = useActionState(editUser, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <>
      {state.errors &&
        state.errors.map((error) => (
          <ErrorMessage key={error}>{error}</ErrorMessage>
        ))}
      <form className=" mt-10 space-y-5" noValidate action={dispatch}>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Tu Nombre"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="name"
            defaultValue={user.name}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="font-bold text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Tu Email"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
            defaultValue={user.email}
          />
        </div>

        <button
          type="submit"
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        >
          {isPending ? <Spinner color="border-amber-500" /> : "Guardar Cambios"}
        </button>
      </form>
    </>
  );
}
