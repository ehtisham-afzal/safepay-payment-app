import { BaseUrl, getSafepayConfig } from "./safepay-config";
import crypto from "crypto";

interface SafepayInitResponse {
  data: {
    token: string;
    created_at: string;
    updated_at: string;
    user: string;
    billing: string;
    client: string;
    environment: string;
    state: string;
    state_reason: string;
    amount: number;
    currency: string;
    default_currency: string;
    conversion_rate: number;
  };
  status: {
    errors: any[];
    message: string;
  };
}

export const initializeSafepayPayment = async (
  amount: number,
  orderId: string,
  currency: string = "PKR"
): Promise<string> => {
  const config = getSafepayConfig();
  
  const response = await fetch(`${config.API_URL}/order/v1/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${config.API_KEY}`
    },
    body: JSON.stringify({
      client: config.API_KEY,
      amount: amount * 100, // Convert to smallest currency unit (paise for PKR)
      currency: currency,
      environment: config.API_URL.includes("sandbox") ? "sandbox" : "production",
      source: "nextjs",
      order_id: orderId,
      redirect_url: `${BaseUrl}/payment/success`,
      cancel_url: `${BaseUrl}/payment/cancel`
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Safepay API Error:", errorData);
    throw new Error(`Failed to initialize Safepay payment: ${response.status} ${response.statusText}`);
  }

  const data: SafepayInitResponse = await response.json();
  
  if (data.status.message !== "success") {
    throw new Error("Failed to initialize Safepay payment");
  }

  return data.data.token;
};

export const constructCheckoutUrl = (
  orderId: string,
  tracker: string,
  successUrl: string,
  cancelUrl: string
): string => {
  const config = getSafepayConfig();
  
  const params = new URLSearchParams({
    env: config.API_URL.includes("sandbox") ? "sandbox" : "production",
    beacon: tracker,
    source: "nextjs",
    order_id: orderId,
    redirect_url: successUrl,
    cancel_url: cancelUrl,
  });

  return `${config.CHECKOUT_URL}?${params.toString()}`;
};

export const validateSignature = (tracker: string, signature: string): boolean => {
  const config = getSafepayConfig();
  const calculatedSignature = crypto
    .createHmac("sha256", config.SECRET_KEY)
    .update(tracker)
    .digest("hex");
  
  return calculatedSignature === signature;
}; 