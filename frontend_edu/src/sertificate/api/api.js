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

export default mainUrl;
