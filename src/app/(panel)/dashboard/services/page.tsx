import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";
import { Suspense } from "react";

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-16 h-16 border-6 border-t-6 border-gray-300 border-t-corsecondary rounded-full animate-spin" />
      </div>
    }>
      <ServicesContent userId={session.user?.id!} />
    </Suspense>
  )
}