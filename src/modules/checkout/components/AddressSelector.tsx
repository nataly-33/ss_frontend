import type { AddressSelectorProps } from "../types";

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onCreateNew,
  isLoading,
}: AddressSelectorProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary mb-4">
          No tienes direcciones guardadas
        </p>
        <button
          onClick={onCreateNew}
          className="text-primary-main hover:text-accent-chocolate font-semibold"
        >
          + Agregar nueva dirección
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-display font-semibold text-text-primary">
          Selecciona una dirección de envío
        </h3>
        <button
          onClick={onCreateNew}
          className="text-sm text-primary-main hover:text-accent-chocolate font-semibold"
          disabled={isLoading}
        >
          + Nueva dirección
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`
              relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
              ${
                selectedAddressId === address.id
                  ? "border-primary-main bg-primary-light"
                  : "border-neutral-light hover:border-primary-main/50"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input
              type="radio"
              name="address"
              value={address.id}
              checked={selectedAddressId === address.id}
              onChange={() => onSelect(address.id)}
              disabled={isLoading}
              className="mt-1 w-4 h-4 text-primary-main focus:ring-primary-main/50"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">
                  {address.direccion_linea1}
                  {address.direccion_linea2 && ` - ${address.direccion_linea2}`}
                </span>
                {address.es_principal && (
                  <span className="px-2 py-0.5 text-xs bg-primary-main text-white rounded-full">
                    Principal
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {address.ciudad}
              </p>
              <p className="text-sm text-text-secondary">
                {address.departamento}, {address.codigo_postal}
              </p>
              {address.referencia && (
                <p className="text-xs text-text-secondary mt-2 italic">
                  Ref: {address.referencia}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
