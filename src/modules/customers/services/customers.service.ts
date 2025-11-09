import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";
import type {
  Address,
  CustomerProfile,
  Favorite,
  CreateAddressData,
  UpdateAddressData,
  UpdateProfileData,
  WalletRechargeData,
} from "../types";

export const customersService = {
  async getProfile(): Promise<CustomerProfile> {
    const response = await api.get<CustomerProfile>(
      ENDPOINTS.CUSTOMERS.PROFILE
    );
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<CustomerProfile> {
    const response = await api.patch<CustomerProfile>(
      ENDPOINTS.CUSTOMERS.PROFILE,
      data
    );
    return response.data;
  },

  async getAddresses(): Promise<Address[]> {
    const response = await api.get<{ results: Address[] }>(
      ENDPOINTS.CUSTOMERS.ADDRESSES
    );
    return (
      response.data.results ||
      (Array.isArray(response.data) ? response.data : [])
    );
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

  async setPrincipalAddress(addressId: string): Promise<Address> {
    const response = await api.post<Address>(
      ENDPOINTS.CUSTOMERS.SET_MAIN_ADDRESS(addressId)
    );
    return response.data;
  },

  async getFavorites(): Promise<Favorite[]> {
    const response = await api.get<{ results: Favorite[] }>(
      ENDPOINTS.CUSTOMERS.FAVORITES
    );
    return (
      response.data.results ||
      (Array.isArray(response.data) ? response.data : [])
    );
  },

  async toggleFavorite(
    prendaId: string
  ): Promise<{ message: string; agregado: boolean }> {
    const response = await api.post<{ message: string; agregado: boolean }>(
      ENDPOINTS.CUSTOMERS.TOGGLE_FAVORITE,
      { prenda_id: prendaId }
    );
    return response.data;
  },

  async getWallet(): Promise<{ saldo: number; transacciones: any[] }> {
    const response = await api.get<any>(ENDPOINTS.CUSTOMERS.WALLET);
    return response.data;
  },

  async rechargeWallet(data: WalletRechargeData): Promise<any> {
    const response = await api.post(ENDPOINTS.CUSTOMERS.WALLET_RECHARGE, data);
    return response.data;
  },

  async changePassword(data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      ENDPOINTS.AUTH.CHANGE_PASSWORD(),
      data
    );
    return response.data;
  },
};
