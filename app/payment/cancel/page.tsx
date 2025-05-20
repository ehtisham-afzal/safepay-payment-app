"use client";

import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        
        <p className="text-gray-600">
          Your payment was cancelled. You can try again or contact support if you need assistance.
        </p>
        
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