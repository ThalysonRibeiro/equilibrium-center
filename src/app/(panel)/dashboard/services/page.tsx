import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";
import { Suspense } from "react";
import { LoadingUI } from "@/components/ui/loading-ui";

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <LoadingUI />
      </div>
    }>
      <ServicesContent userId={session.user?.id!} />
    </Suspense>
  )
}