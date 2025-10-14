"use client";
import { authenticate } from "@/actions/authenticate-user-action";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";
import { useRouter } from "next/navigation";


export default function LoginForm() {

  const navigate = useRouter();

  const [state, dispatch, isPending] = useActionState(authenticate, {
    errors: [],
    success: ""
  })

  useEffect(()=>{
      state.success? 
        toast.success("Has iniciado sesión con exito", {onClose: ()=>{navigate.push("/")}, autoClose:2500})
      : state.errors.map(error=>toast.error(error))
      
  }, [state])

  return (
    <>
      <form className="mt-5 lg:mt-10 space-y-5" noValidate action={dispatch}>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
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

        <button
          type="submit"
         
          className="bg-purple-950 hover:bg-purple-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        >{isPending ? <Spinner color="text-orange-400"/> : "Iniciar Sesion"}</button>
      </form>
    </>
  );
}
