import api from "@core/config/api.config";

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

export const customersService = {
  // Profile
  async getProfile(): Promise<CustomerProfile> {
    const response = await api.get<CustomerProfile>("/customers/profile/");
    return response.data;
  },

  async updateProfile(profileId: string, data: Partial<CustomerProfile>) {
    const response = await api.patch(`/customers/profile/${profileId}/`, data);
    return response.data;
  },

  // Addresses
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<Address[]>("/customers/addresses/");
    return response.data;
  },

  async createAddress(data: Omit<Address, "id">): Promise<Address> {
    const response = await api.post<Address>("/customers/addresses/", data);
    return response.data;
  },

  async updateAddress(
    addressId: string,
    data: Partial<Address>
  ): Promise<Address> {
    const response = await api.patch<Address>(
      `/customers/addresses/${addressId}/`,
      data
    );
    return response.data;
  },

  async deleteAddress(addressId: string) {
    const response = await api.delete(`/customers/addresses/${addressId}/`);
    return response.data;
  },

  // Favorites
  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get<Favorite[]>("/customers/favorites/");
    return response.data;
  },

  async addFavorite(prendaId: string): Promise<Favorite> {
    const response = await api.post<Favorite>("/customers/favorites/", {
      prenda_id: prendaId,
    });
    return response.data;
  },

  async removeFavorite(favoriteId: string) {
    const response = await api.delete(`/customers/favorites/${favoriteId}/`);
    return response.data;
  },

  // Wallet
  async rechargeWallet(amount: number) {
    const response = await api.post("/customers/wallet/recharge/", { amount });
    return response.data;
  },
};
