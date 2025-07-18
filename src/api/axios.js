import axios from "axios";
import { store } from "../redux/store";
import { setAccessToken, setLogout } from "../redux/slices/authSlice";
import { setUser } from "../redux/slices/userSlice";

const api_url = import.meta.env.VITE_API_URL;

// Instance cho request bình thường
const axiosAuth = axios.create({
  baseURL: api_url,
  withCredentials: true,
});

// Instance chuyên cho refresh token
const axiosRefresh = axios.create({
  baseURL: api_url,
  withCredentials: true,
});

// Interceptor cho axiosAuth
axiosAuth.interceptors.request.use(
  (config) => {
    const token =
      store.getState().auth?.access_token ||
      localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

axiosAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) return Promise.reject(error);

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const res = await axiosRefresh.post("/refresh-token");
        const { access_token, user } = res.data.DT;

        store.dispatch(setAccessToken(access_token));
        store.dispatch(setUser(user));
        localStorage.setItem("access_token", access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        isRefreshing = false;

        return axiosAuth(originalRequest);
      } catch (err) {
        store.dispatch(setLogout());
        store.dispatch(setUser(null));
        localStorage.removeItem("access_token");
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAuth;
