import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { getSession } from "@/src/auth/dal";
import LinkNavbar from "@/components/ui/LinkNavbar";

export default async function NotFound() {
  const session = await getSession();

  const navigation = {
    "no-session": {
      nav: (
        <>
          <LinkNavbar href="/auth/login" label="Iniciar Sesión" />
          <LinkNavbar href="/auth/register" label="Registarse" />
        </>
      ),
      volver: {
        href: "/",
        label: "Volver",
      },
    },
    session: {
      nav: (
        <>
          <LinkNavbar href="/admin" label="Dashboard" />
          <LinkNavbar href="/admin/profile/settings" label="Mi Perfil" />
        </>
      ),
      volver: {
        href: "/admin",
        label: "Ir a dashboard",
      },
    },
  };

  return (
    <>
      <header className=" bg-purple-950 py-5">
        <div className="max-w-3xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-96 lg:w-[500px]">
            <Logo />
          </div>
          <nav className="flex flex-col lg:flex-row lg:justify-end gap-5 w-full ">
            {session ? navigation["session"].nav : navigation["no-session"].nav}
          </nav>
        </div>
      </header>
      <div className="space-y-5 p-20">
        <h1 className="font-black text-4xl text-purple-950">
          Página no encontrada
        </h1>
        <p className="text-xl font-bold">
          La página que intentas acceder {""}{" "}
          <span className="text-amber-500">no existe</span>
        </p>
        <Link
          href={
            session
              ? navigation["session"].volver.href
              : navigation["no-session"].volver.href
          }
          className="bg-amber-500 px-10 py-2 rounded-lg text-white font-bold cursor-pointer inline-block"
        >
          {session
            ? navigation["session"].volver.label
            : navigation["no-session"].volver.label}
        </Link>
      </div>
    </>
  );
}
