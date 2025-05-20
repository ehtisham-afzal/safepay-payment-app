"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { validateSignature } from "@/lib/safepay";
import { Button } from "@/components/ui/button";

function PaymentSuccessResultContent() {
  const searchParams = useSearchParams();
  const tracker = searchParams.get("tracker");
  const signature = searchParams.get("signature");
  const orderId = searchParams.get("order_id");
  const referenceCode = searchParams.get("reference_code");

  let valid = false;
  if (tracker && signature) {
    valid = validateSignature(tracker, signature);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">
          {valid ? "Payment Successful!" : "Payment Error"}
        </h1>
        <p className="text-gray-600">
          {valid
            ? `Your order (${orderId}) has been confirmed. Reference: ${referenceCode}`
            : "Payment validation failed. Please contact support."}
        </p>
        <Button onClick={() => (window.location.href = "/")} className="mt-4">
          Return to Home
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessResult() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    }>
      <PaymentSuccessResultContent />
    </Suspense>
  );
}
