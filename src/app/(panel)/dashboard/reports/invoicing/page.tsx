import { Suspense } from "react";
import { InvoicingContent } from "./_components/invoicing-content";
import { LoadingUI } from "@/components/ui/loading-ui";

export default function Invoicing() {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex justify-center items-center">
        <LoadingUI />
      </div>
    }>
      <InvoicingContent />
    </Suspense>
  )
}