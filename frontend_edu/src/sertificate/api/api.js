import axios from "axios";
const mainUrl = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/"
});

mainUrl.interceptors.request.use((config) => {
  const token = localStorage.getItem("userSert");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Token eskirgan yoki yaroqsiz bo'lsa (401) sessiyani tozalab, login sahifasiga o'tkazish
mainUrl.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes("/auth/login");
    const hasSession = localStorage.getItem("userSert") || localStorage.getItem("user");

    if (error.response?.status === 401 && !isLogin && hasSession) {
      localStorage.removeItem("user");
      localStorage.removeItem("userSert");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default mainUrl;
