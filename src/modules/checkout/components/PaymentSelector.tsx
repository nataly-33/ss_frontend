import type { PaymentSelectorProps } from "../types";
import { CreditCard, Banknote, Wallet } from "lucide-react";

const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  efectivo: <Banknote className="w-6 h-6" />,
  tarjeta: <CreditCard className="w-6 h-6" />,
  paypal: <Wallet className="w-6 h-6" />,
  stripe: <CreditCard className="w-6 h-6" />,
};

export function PaymentSelector({
  paymentMethods,
  selectedMethodId,
  onSelect,
  isLoading
}: PaymentSelectorProps) {
  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">No hay métodos de pago disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
        Selecciona un método de pago
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`
              relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all
              ${selectedMethodId === method.id
                ? 'border-primary-main bg-primary-light'
                : 'border-neutral-light hover:border-primary-main/50'
              }
              ${!method.activo || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedMethodId === method.id}
              onChange={() => onSelect(method.id)}
              disabled={!method.activo || isLoading}
              className="sr-only"
            />
            
            <div className="flex items-center gap-3 mb-2">
              <div className={`
                p-2 rounded-lg
                ${selectedMethodId === method.id ? 'bg-primary-main text-white' : 'bg-neutral-light text-text-secondary'}
              `}>
                {PAYMENT_ICONS[method.tipo.toLowerCase()] || <CreditCard className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary">{method.nombre}</h4>
                {!method.activo && (
                  <span className="text-xs text-red-600">No disponible</span>
                )}
              </div>
              {selectedMethodId === method.id && (
                <div className="w-5 h-5 bg-primary-main rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {method.descripcion && (
              <p className="text-xs text-text-secondary mt-1">{method.descripcion}</p>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
