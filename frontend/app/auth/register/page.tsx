import type {Metadata} from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CashTrackr - Crear Cuenta",
  description: "CashTrackr - Crear Cuenta",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">Crea una cuenta</h1>
      <p className="text-3xl font-bold">
        y controla tus <span className="text-amber-500">finanzas</span>
      </p>

      <RegisterForm />
      <nav className="text-center mt-2 flex flex-col space-y-4">
        <Link
          href={"/auth/login"}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
      </nav>
    </>
  );
}
