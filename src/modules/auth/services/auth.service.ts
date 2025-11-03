import api from "@core/config/api.config";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login/", { email, password });
    return response.data;
  },

  async register(data: any) {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  async refreshToken(refresh: string) {
    const response = await api.post("/auth/refresh/", { refresh });
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/users/me/");
    return response.data;
  },

  async logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};
