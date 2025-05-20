"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { validateSignature } from "@/lib/safepay";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const tracker = searchParams.get("tracker");
        const signature = searchParams.get("signature");
        const orderId = searchParams.get("order_id");
        const referenceCode = searchParams.get("reference_code");

        if (!tracker || !signature || !orderId || !referenceCode) {
          throw new Error("Missing required payment parameters");
        }

        const isValid = validateSignature(tracker, signature);

        if (!isValid) {
          throw new Error("Invalid payment signature");
        }

        // Here you would typically:
        // 1. Update your database with the payment status
        // 2. Save the reference code and tracker
        // 3. Mark the order as complete

        setStatus("success");
        setMessage("Payment successful! Your order has been confirmed.");
      } catch (error) {
        console.error("Payment validation failed:", error);
        setStatus("error");
        setMessage("Payment validation failed. Please contact support.");
      }
    };

    validatePayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">
          {status === "loading" && "Processing Payment..."}
          {status === "success" && "Payment Successful!"}
          {status === "error" && "Payment Error"}
        </h1>
        
        <p className="text-gray-600">{message}</p>
        
        <Button
          onClick={() => window.location.href = "/"}
          className="mt-4"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
} 