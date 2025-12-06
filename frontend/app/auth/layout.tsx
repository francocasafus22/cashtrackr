import Logo from "@/components/ui/Logo";
import ToastNotification from "@/components/ui/ToastNotification";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Lado izquierdo con fondo */}
        <div className="flex justify-center bg-purple-950 background-auth">
          <div className="py-10 lg:py-20 w-96">
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>
        </div>

        {/* Lado derecho con contenido */}
        <div className="p-10 flex items-center">
          <div
            className="w-full
         max-w-2xl mx-auto"
          >
            {children}
          </div>
        </div>
      </div>

      <ToastNotification />
    </>
  );
}
