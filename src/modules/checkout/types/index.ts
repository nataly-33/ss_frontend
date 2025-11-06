import type { PaymentMethod } from "@modules/orders/types";
import type { Cart } from "@modules/cart/types";
import type { Address } from "@modules/customers/types";

export interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void;
  onCreateNew: () => void;
  isLoading?: boolean;
}

export interface OrderSummaryProps {
  cart: Cart;
  selectedAddress: Address | null;
  selectedPaymentMethod: PaymentMethod | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export interface PaymentSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId: string | null;
  onSelect: (methodId: string) => void;
  isLoading?: boolean;
}