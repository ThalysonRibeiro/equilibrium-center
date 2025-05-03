import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  trustHost: true,
  providers: [GitHub, Discord],
})