import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type { 
  Address, 
  CustomerProfile, 
  Favorite,
  CreateAddressData,
  UpdateAddressData,
  UpdateProfileData,
  WalletRechargeData 
} from "../types";

export const customersService = {
  // Profile
  async getProfile(): Promise<CustomerProfile> {
    const response = await api.get<CustomerProfile>(ENDPOINTS.CUSTOMERS.PROFILE);
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<CustomerProfile> {
    const response = await api.patch<CustomerProfile>(
      ENDPOINTS.CUSTOMERS.UPDATE_PROFILE, 
      data
    );
    return response.data;
  },

  // Addresses
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<{ results: Address[] }>(
      ENDPOINTS.CUSTOMERS.ADDRESSES
    );
    return response.data.results || response.data;
  },

  async createAddress(data: CreateAddressData): Promise<Address> {
    const response = await api.post<Address>(
      ENDPOINTS.CUSTOMERS.ADDRESSES, 
      data
    );
    return response.data;
  },

  async updateAddress(
    addressId: string,
    data: UpdateAddressData
  ): Promise<Address> {
    const response = await api.patch<Address>(
      ENDPOINTS.CUSTOMERS.ADDRESS_BY_ID(addressId),
      data
    );
    return response.data;
  },

  async deleteAddress(addressId: string): Promise<void> {
    await api.delete(ENDPOINTS.CUSTOMERS.ADDRESS_BY_ID(addressId));
  },

  // Favorites
  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get<{ results: Favorite[] }>(
      ENDPOINTS.CUSTOMERS.FAVORITES
    );
    return response.data.results || response.data;
  },

  async addFavorite(prendaId: string): Promise<Favorite> {
    const response = await api.post<Favorite>(
      ENDPOINTS.CUSTOMERS.ADD_FAVORITE,
      { prenda_id: prendaId }
    );
    return response.data;
  },

  async removeFavorite(productId: string): Promise<void> {
    await api.delete(ENDPOINTS.CUSTOMERS.REMOVE_FAVORITE(productId));
  },

  // Wallet
  async rechargeWallet(data: WalletRechargeData): Promise<any> {
    const response = await api.post("/api/customers/wallet/recharge/", data);
    return response.data;
  },
};
