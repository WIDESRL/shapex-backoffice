export interface StripePaymentData {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ApplePaymentData {
  applePaymentId: string;
  decodedTransaction: {
    type: string;
    price: number;
    bundleId: string;
    currency: string;
    quantity: number;
    productId: string;
    signedDate: number;
    storefront: string;
    environment: string;
    purchaseDate: number;
    storefrontId: string;
    transactionId: string;
    transactionReason: string;
    inAppOwnershipType: string;
    originalPurchaseDate: number;
    originalTransactionId: string;
  };
  latestReceiptInfo: null | Record<string, unknown>;
  pendingRenewalInfo: null | Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AndroidPaymentData {
  androidPaymentId: string;
  latestPurchaseData: {
    orderId: string;
    quantity: number;
    productId: string;
    packageName: string;
    acknowledged: boolean;
    purchaseTime: number;
    purchaseState: number;
    purchaseToken: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Call {
  id: number;
  type: 'Extra' | 'Supplementary';
  usedAt: string | null;
  createdAt: string;
  product?: {
    id: number;
    title: string;
    price: number;
  };
  subscription?: {
    id: number;
    subscription: {
      title: string;
    };
  };
  order?: {
    id: number;
    totalAmount: number;
    stripePaymentIntentId?: string;
    stripePaymentData?: StripePaymentData;
    applePaymentData?: ApplePaymentData;
    androidPaymentData?: AndroidPaymentData;
  };
}
