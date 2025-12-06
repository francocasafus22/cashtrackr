import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `CashTrackr - Change Password`,
    description: `CashTrackr - Change Password`,
  };
}

export default async function ChangePasswordPage() {
  return (
    <>
      <h1 className="font-black text-4xl text-purple-950 my-5">
        Cambiar Password
      </h1>
      <p className="text-xl font-bold">
        Aquí puedes cambiar tu {""}
        <span className="text-amber-500">password</span>
      </p>

      <ChangePasswordForm />
    </>
  );
}
