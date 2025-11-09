import type { Address } from "../types";
import { MapPin, Edit2, Trash2, Star } from "lucide-react";
import { Button } from "@shared/components/ui/Button";

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetPrincipal: (addressId: string) => void;
  isLoading?: boolean;
}

export function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetPrincipal,
  isLoading = false,
}: AddressListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
        <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
          No tienes direcciones guardadas
        </h3>
        <p className="text-text-secondary">
          Agrega tu primera dirección para facilitar tus compras
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`
            relative bg-white rounded-xl shadow-md p-6 border-2 transition-all
            ${
              address.es_principal
                ? "border-primary-main bg-primary-light/30"
                : "border-transparent hover:border-neutral-200"
            }
          `}
        >
          {/* Badge Principal */}
          {address.es_principal && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 bg-primary-main text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                Principal
              </div>
            </div>
          )}

          {/* Título */}
          <div className="mb-3">
            <h3 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-main" />
              Mi dirección
            </h3>
          </div>

          {/* Dirección */}
          <div className="space-y-1 mb-4 text-text-secondary">
            <p className="font-medium">{address.nombre_completo}</p>
            <p className="text-sm text-text-secondary">{address.telefono}</p>
            <p>
              {address.direccion_linea1}
              {address.direccion_linea2 && `, ${address.direccion_linea2}`}
            </p>
            <p>
              {address.ciudad}, {address.departamento}
              {address.codigo_postal && ` - CP ${address.codigo_postal}`}
            </p>
            {address.referencia && (
              <p className="text-sm italic mt-2">Ref: {address.referencia}</p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-4 border-t">
            {!address.es_principal && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetPrincipal(address.id)}
                className="flex-1"
              >
                <Star className="w-4 h-4 mr-1" />
                Hacer principal
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
              <Edit2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("¿Seguro que deseas eliminar esta dirección?")) {
                  onDelete(address.id);
                }
              }}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
