export const SAFEPAY_CONFIG = {
    PRODUCTION: {
      API_URL: "https://api.getsafepay.com",
      CHECKOUT_URL: "https://www.getsafepay.com/components",
      API_KEY: process.env.NEXT_PUBLIC_SAFEPAY_PRODUCTION_API_KEY || "",
      SECRET_KEY: process.env.SAFEPAY_PRODUCTION_SECRET_KEY || "",
    },
    SANDBOX: {
      API_URL: "https://sandbox.api.getsafepay.com",
      CHECKOUT_URL: "https://sandbox.api.getsafepay.com/components",
      API_KEY: process.env.NEXT_PUBLIC_SAFEPAY_SANDBOX_API_KEY || "",
      SECRET_KEY: process.env.SAFEPAY_SANDBOX_SECRET_KEY || "",
    },
  };

  export const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  
  export const isSandbox = process.env.NEXT_PUBLIC_SAFEPAY_ENVIRONMENT === "sandbox";
  
  export const getSafepayConfig = () => {
    return isSandbox ? SAFEPAY_CONFIG.SANDBOX : SAFEPAY_CONFIG.PRODUCTION;
  }; 