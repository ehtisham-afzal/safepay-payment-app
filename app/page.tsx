"use client";

import { useId, useState } from "react";
import { CreditCardIcon } from "lucide-react";
import { usePaymentInputs } from "react-payment-inputs";
import images, { type CardImages } from "react-payment-inputs/images";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { initializeSafepayPayment, constructCheckoutUrl } from "@/lib/safepay"
import { BaseUrl, SAFEPAY_CONFIG } from "@/lib/safepay-config";

export default function Home() {
  const router = useRouter();
  const id = useId();
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();

  const handlePayment = async () => {
    try {
      setError("");
      setIsLoading(true);
      
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Generate orderId ONCE
      const orderId = `ORDER_${Date.now()}`;

      // Pass orderId to the API call
      const tracker = await initializeSafepayPayment(amountValue, orderId);
      
      // Use the same orderId in the checkout URL
      const successUrl = `${BaseUrl}/payment/success`;
      const cancelUrl = `${BaseUrl}/payment/cancel`;
      const checkoutUrl = constructCheckoutUrl(orderId, tracker, successUrl, cancelUrl);
      
      // Redirect to Safepay checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setError(error instanceof Error ? error.message : "Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center container h-full min-h-screen w-full min-w-full">
      <div className="flex flex-col gap-2">
        <div className="*:not-first:mt-2">
          <legend className="text-foreground text-sm font-medium">
            Amount (PKR)
          </legend>
          <Input
            className="shadow-none [direction:inherit]"
            id={`amount-${id}`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
          />
        </div>
        <div className="*:not-first:mt-2">
          <legend className="text-foreground text-sm font-medium">
            Card Details
          </legend>
          <div className="rounded-md shadow-xs">
            <div className="relative focus-within:z-10">
              <Input
                className="peer rounded-b-none pe-9 shadow-none [direction:inherit]"
                {...getCardNumberProps()}
                id={`number-${id}`}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                {meta.cardType ? (
                  <svg
                    className="overflow-hidden rounded-sm"
                    {...getCardImageProps({
                      images: images as unknown as CardImages,
                    })}
                    width={20}
                  />
                ) : (
                  <CreditCardIcon size={16} aria-hidden="true" />
                )}
              </div>
            </div>
            <div className="-mt-px flex">
              <div className="min-w-0 flex-1 focus-within:z-10">
                <Input
                  className="rounded-e-none rounded-t-none shadow-none [direction:inherit]"
                  {...getExpiryDateProps()}
                  id={`expiry-${id}`}
                />
              </div>
              <div className="-ms-px min-w-0 flex-1 focus-within:z-10">
                <Input
                  className="rounded-s-none rounded-t-none shadow-none [direction:inherit]"
                  {...getCVCProps()}
                  id={`cvc-${id}`}
                />
              </div>
            </div>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <Button 
          className="mt-4" 
          onClick={handlePayment}
          disabled={isLoading || !amount}
        >
          {isLoading ? "Processing..." : "Proceed to pay"}
        </Button>
      </div>
    </div>
  );
}











// "use client";

// import { useId } from "react";
// import { CreditCardIcon } from "lucide-react";
// import { usePaymentInputs } from "react-payment-inputs";
// import images, { type CardImages } from "react-payment-inputs/images";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//   const id = useId();
//   const {
//     meta,
//     getCardNumberProps,
//     getExpiryDateProps,
//     getCVCProps,
//     getCardImageProps,
//   } = usePaymentInputs();
//   return (
//     <div className="flex flex-col justify-center items-center container h-full min-h-screen w-full min-w-full">
//       <div className="flex flex-col gap-2">
//         <div className="*:not-first:mt-2">
//           <legend className="text-foreground text-sm font-medium">
//             Amount
//           </legend>
//           <Input
//             className="shadow-none [direction:inherit]"
//             id={`anount-${id}`}
//             type="number"
//           />
//         </div>
//         <div className="*:not-first:mt-2">
//           <legend className="text-foreground text-sm font-medium">
//             Card Details
//           </legend>
//           <div className="rounded-md shadow-xs">
//             <div className="relative focus-within:z-10">
//               <Input
//                 className="peer rounded-b-none pe-9 shadow-none [direction:inherit]"
//                 {...getCardNumberProps()}
//                 id={`number-${id}`}
//               />
//               <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
//                 {meta.cardType ? (
//                   <svg
//                     className="overflow-hidden rounded-sm"
//                     {...getCardImageProps({
//                       images: images as unknown as CardImages,
//                     })}
//                     width={20}
//                   />
//                 ) : (
//                   <CreditCardIcon size={16} aria-hidden="true" />
//                 )}
//               </div>
//             </div>
//             <div className="-mt-px flex">
//               <div className="min-w-0 flex-1 focus-within:z-10">
//                 <Input
//                   className="rounded-e-none rounded-t-none shadow-none [direction:inherit]"
//                   {...getExpiryDateProps()}
//                   id={`expiry-${id}`}
//                 />
//               </div>
//               <div className="-ms-px min-w-0 flex-1 focus-within:z-10">
//                 <Input
//                   className="rounded-s-none rounded-t-none shadow-none [direction:inherit]"
//                   {...getCVCProps()}
//                   id={`cvc-${id}`}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <Button className="mt-4">Proceed to pay</Button>
//       </div>
//     </div>
//   );
// }
