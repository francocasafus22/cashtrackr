"use server";

import getToken from "@/src/auth/token";
import { EditUserSchema, ErrorSchema, SuccessSchema } from "@/src/schemas";
import { revalidatePath } from "next/cache";

type ActionStateType = {
  errors: string[];
  success: string;
};

export default async function editUser(
  prevState: ActionStateType,
  formData: FormData,
) {
  const userSchema = EditUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!userSchema.success) {
    return {
      errors: userSchema.error.issues.map((issue) => issue.message),
      success: "",
    };
  }

  const token = await getToken();
  const url = `${process.env.API_URL}/auth/user`;
  const req = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: userSchema.data.name,
      email: userSchema.data.email,
    }),
  });

  const json = await req.json();

  if (!req.ok) {
    const { error } = ErrorSchema.parse(json);
    return {
      errors: [error],
      success: "",
    };
  }

  const { message } = SuccessSchema.parse(json);

  revalidatePath("/admin/profile/settings");

  return {
    errors: [],
    success: message,
  };
}
