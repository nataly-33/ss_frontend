import api from "@core/config/api.config";
import { ENDPOINTS } from "@/core/config/endpoints";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  password_confirm: string;
  telefono?: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: any;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<any> {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, data);
      return response.data;
    } catch (error: any) {
      console.error("Register error:", error.response?.data);
      throw error;
    }
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REFRESH, { refresh });
      return response.data;
    } catch (error: any) {
      console.error("Refresh token error:", error.response?.data);
      throw error;
    }
  },

  async getProfile(): Promise<any> {
    try {
      const response = await api.get(ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error: any) {
      console.error("Get profile error:", error.response?.data);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },
};
