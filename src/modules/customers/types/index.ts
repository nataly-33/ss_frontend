export interface Address {
  id: string;
  calle: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
  es_principal: boolean;
  referencias?: string;
}

export interface CustomerProfile {
  id: string;
  usuario: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  saldo_billetera: number;
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
  fecha_agregado: string;
}

export interface CreateAddressData extends Omit<Address, "id"> {}

export interface UpdateAddressData extends Partial<Address> {}

export interface UpdateProfileData extends Partial<CustomerProfile> {}

export interface AddFavoriteData {
  prenda_id: string;
}

export interface WalletRechargeData {
  amount: number;
}
