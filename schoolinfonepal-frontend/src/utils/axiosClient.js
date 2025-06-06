import axios from "axios";
import jwt_decode from "jwt-decode";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
});

axiosClient.interceptors.request.use(async (config) => {
  let access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  const isExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  if (access && isExpired(access) && refresh) {
    try {
      const res = await fetch(`${axiosClient.defaults.baseURL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (res.ok) {
        const data = await res.json();
        access = data.access;
        localStorage.setItem("access", access);
      } else {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Token refresh error:", err);
    }
  }

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

export default axiosClient;
