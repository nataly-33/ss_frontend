import type { OrderSummaryProps } from "../types";

export function OrderSummary({
  cart,
  selectedAddress,
  selectedPaymentMethod,
  notes,
  onNotesChange,
  onConfirm,
  isProcessing
}: OrderSummaryProps) {
  const shipping = 0; // Envío gratuito
  const subtotal = cart.total;
  const total = subtotal + shipping;

  const canConfirm = selectedAddress && selectedPaymentMethod && !isProcessing;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-display font-bold text-text-primary mb-6">
        Resumen del pedido
      </h3>

      {/* Items */}
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {item.prenda.imagen_principal && (
              <img
                src={item.prenda.imagen_principal}
                alt={item.prenda.nombre}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">
                {item.prenda.nombre}
              </p>
              <p className="text-xs text-text-secondary">
                Talla: {item.talla.nombre} | Cant: {item.cantidad}
              </p>
              <p className="text-sm font-semibold text-primary-main">
                ${item.subtotal.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Address */}
      {selectedAddress && (
        <div className="mb-6 p-4 bg-background-light rounded-lg">
          <h4 className="font-semibold text-text-primary text-sm mb-2">
            Dirección de envío
          </h4>
          <p className="text-sm text-text-secondary">
            {selectedAddress.calle} {selectedAddress.numero_exterior}
            {selectedAddress.numero_interior && ` - ${selectedAddress.numero_interior}`}
          </p>
          <p className="text-sm text-text-secondary">
            {selectedAddress.colonia}, {selectedAddress.ciudad}
          </p>
        </div>
      )}

      {/* Payment Method */}
      {selectedPaymentMethod && (
        <div className="mb-6 p-4 bg-background-light rounded-lg">
          <h4 className="font-semibold text-text-primary text-sm mb-2">
            Método de pago
          </h4>
          <p className="text-sm text-text-secondary">{selectedPaymentMethod.nombre}</p>
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Notas del pedido (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Ej: Dejar en portería, tocar timbre 2 veces..."
          rows={3}
          className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary-main/50 focus:border-primary-main text-sm resize-none"
          disabled={isProcessing}
        />
      </div>

      {/* Totals */}
      <div className="space-y-3 mb-6 pt-6 border-t border-neutral-light">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Envío</span>
          <span className="font-semibold text-green-600">Gratis</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-neutral-light">
          <span className="text-lg font-display font-bold text-text-primary">Total</span>
          <span className="text-2xl font-display font-bold text-primary-main">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold transition-all
          ${canConfirm
            ? 'bg-primary-main text-white hover:bg-accent-chocolate hover:shadow-lg'
            : 'bg-neutral-light text-text-secondary cursor-not-allowed'
          }
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Procesando...
          </span>
        ) : (
          'Confirmar pedido'
        )}
      </button>

      {!canConfirm && !isProcessing && (
        <p className="text-xs text-red-600 text-center mt-2">
          {!selectedAddress && 'Selecciona una dirección de envío'}
          {!selectedPaymentMethod && !selectedAddress && ' y '}
          {!selectedPaymentMethod && 'Selecciona un método de pago'}
        </p>
      )}
    </div>
  );
}
