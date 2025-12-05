import type Metadata from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPassword";

export const metadata: Metadata = {
  title: "CashTrackr - Olvidé mi contraseña",
  description: "CashTrackr - Olvidé mi contraseña",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-black text-6xl text-purple-950">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="text-3xl font-bold">
        aquí puedes <span className="text-amber-500">restablecerla</span>
      </p>

      <ForgotPasswordForm />

      <nav className="text-center mt-2 flex flex-col space-y-4">
        <Link
          href={"/auth/login"}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
        >
          ¿No tienes una cuenta? Registrarse
        </Link>
      </nav>
    </>
  );
}
