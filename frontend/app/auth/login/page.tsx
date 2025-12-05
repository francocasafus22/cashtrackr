import type Metadata from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "CashTrackr - Iniciar Sesión",
  description: "CashTrackr - Iniciar Sesión",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">Iniciar sesión</h1>
      <p className="text-3xl font-bold">
        y controla tus <span className="text-amber-500">finanzas</span>
      </p>

      <LoginForm />
      <nav className="text-center mt-2 flex flex-col ">
        <Link
          href={"/auth/register"}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          ¿No tienes cuenta? Registrarse
        </Link>
        <Link
          href={"/auth/forgot-password"}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          ¿Olvidate tu contraseña? Ingresa aquí
        </Link>
      </nav>
    </>
  );
}
