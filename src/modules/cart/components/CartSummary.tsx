import { ArrowRight } from "lucide-react";
import { Button } from "@shared/components/ui/Button";

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CartSummary({ total, itemCount, onCheckout, isLoading }: CartSummaryProps) {
  const shipping = 0; // Envío gratuito
  const subtotal = total;
  const finalTotal = subtotal + shipping;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
        Resumen del pedido
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-text-secondary">
          <span>Envío</span>
          <span className="font-semibold text-green-600">Gratis</span>
        </div>

        <div className="border-t border-neutral-light pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-display font-bold text-text-primary">Total</span>
            <span className="text-2xl font-display font-bold text-primary-main">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onCheckout}
        isLoading={isLoading}
      >
        <span>Proceder al pago</span>
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      <div className="mt-6 space-y-2 text-sm text-text-secondary">
        <p className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Envío gratuito en todos los pedidos
        </p>
        <p className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Devoluciones gratuitas hasta 30 días
        </p>
        <p className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Pago seguro garantizado
        </p>
      </div>
    </div>
  );
}
