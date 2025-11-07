export interface Address {
  id: string;
  nombre_completo: string;
  telefono: string;
  direccion_linea1: string;
  direccion_linea2?: string;
  ciudad: string;
  departamento: string;
  codigo_postal: string;
  pais: string;
  referencia?: string;
  es_principal: boolean;
  activa: boolean;
  direccion_completa?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo?: string;
  telefono?: string;
  foto_perfil?: string;
  saldo_billetera: number;
  email_verificado: boolean;
  direccion_principal?: Address;
  total_compras: number;
  total_favoritos: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  prenda: {
    id: string;
    nombre: string;
    slug: string;
    precio: number;
    imagen_principal?: string;
  };
  created_at: string;
}

export interface CreateAddressData extends Omit<Address, "id"> {}

export interface UpdateAddressData extends Partial<Address> {}

export interface UpdateProfileData extends Partial<CustomerProfile> {}

export interface AddFavoriteData {
  prenda_id: string;
}

export interface WalletRechargeData {
  monto: number;
  metodo_pago: 'tarjeta' | 'transferencia';
}
