import { LoadingUI } from "@/components/ui/loading-ui";
import { AllAppointmentClient } from "./_components/all-appointments-client";
import { Suspense } from "react";

export default function Client() {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <LoadingUI />
      </div>
    }>
      <AllAppointmentClient />
    </Suspense>
  )
}