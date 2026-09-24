import Iyzipay from "iyzipay";

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || "sandbox-api-key",
  secretKey: process.env.IYZICO_SECRET_KEY || "sandbox-secret-key",
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

// Helper function to initialize checkout form
export const initializeCheckoutForm = (request: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Helper function to retrieve checkout form result
export const retrieveCheckoutFormResult = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ token }, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
