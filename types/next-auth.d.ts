import { Plan } from "@/generated/prisma";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user']
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: null | string | boolean;
  image?: string;
  address?: string;
  phone?: string;
  status: boolean;
  plan: Plan;
  stripe_customer_id?: string;
  createdAt: string;
  updatedAt: string;
}