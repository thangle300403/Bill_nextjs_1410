import axios from "axios";
import { EventEmitter } from "events";

export const expressAuthEvents = new EventEmitter();

// ✅ Create Express API axios instance
export const axiosExpress = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NODE_API_URL,
  withCredentials: true, // ✅ allow cookies
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Handle 401 errors and refresh tokens
axiosExpress.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosExpress(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🌀 Refresh using NestJS /refresh endpoint
        await axios.post(
          `${process.env.NEXT_PUBLIC_NEST_API_URL}/refresh`,
          {},
          { withCredentials: true }
        );

        expressAuthEvents.emit("refreshDone");
        processQueue(null);

        // Retry the failed request
        return axiosExpress(originalRequest);
      } catch (refreshErr) {
        console.error("[Express AXIOS] Refresh failed:", refreshErr);
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
