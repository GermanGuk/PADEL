"use server";

import { redirect } from "next/navigation";
import { checkPassword, createAdminSession } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Введите пароль." };
  }

  if (!checkPassword(password)) {
    return { error: "Неверный пароль." };
  }

  await createAdminSession();
  redirect("/admin");
}
