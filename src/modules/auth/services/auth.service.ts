import api from "@core/config/api.config";

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post("/auth/login/", { email, password });
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  },

  async register(data: any) {
    try {
      const response = await api.post("/auth/register/register/", data);
      return response.data;
    } catch (error: any) {
      console.error("Register error:", error.response?.data);
      throw error;
    }
  },

  async refreshToken(refresh: string) {
    try {
      const response = await api.post("/auth/refresh/", { refresh });
      return response.data;
    } catch (error: any) {
      console.error("Refresh token error:", error.response?.data);
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/auth/users/me/");
      return response.data;
    } catch (error: any) {
      console.error("Get profile error:", error.response?.data);
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};
