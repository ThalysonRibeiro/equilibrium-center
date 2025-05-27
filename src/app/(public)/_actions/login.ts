"use server"
import { signIn } from "@/lib/auth";

export type LoginType = "github" | "discord" | "google";

export async function handleRegister(provider: LoginType) {
  await signIn(provider, { redirectTo: "/dashboard" })
}