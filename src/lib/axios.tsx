"use client";
import axios from "axios";

let accessToken: string | null = null;

// hàm set access token vào memory
export const setAccessToken = (token: string) => {
  accessToken = token;
};

// axios instance
export const api = axios.create({
  baseURL: "https://c-lims-api.test.dtp-dev.site:6443",
  withCredentials: true, 
});

// interceptor tự gắn access token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// interceptor tự refresh token
let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Nếu lỗi 401
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.get(
          "https://c-lims-api.test.dtp-dev.site:6443/auth/refresh",
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken);

        queue.forEach((cb) => cb(newAccessToken));
        queue = [];

        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (e) {
        isRefreshing = false;
        queue = [];
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);
