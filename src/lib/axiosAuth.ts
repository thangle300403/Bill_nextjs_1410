import axios from "axios";
import { EventEmitter } from "events";

export const authEvents = new EventEmitter();

// ✅ Create client-side axios instance
export const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_API_URL,
  withCredentials: true,
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

// ✅ Handle 401 errors and auto-refresh
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("🧭 [Interceptor Triggered]");
    console.log("➡️ Error URL:", originalRequest.url);
    console.log("➡️ Error Status:", error.response?.status);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      if (isRefreshing) {
        console.log("🔁 [401 detected] Attempting refresh...");
        // queue requests until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosAuth(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("[AXIOS] Refreshing token...");
        // 🔄 Request new access token
        const sq = await axios.post(
          `${process.env.NEXT_PUBLIC_NEST_API_URL}/refresh`,
          {},
          { withCredentials: true }
        );

        console.log("Refresh response:", sq.data);

        authEvents.emit("refreshDone");
        processQueue(null);

        // Retry original request after token refresh
        return axiosAuth(originalRequest);
      } catch (refreshErr) {
        console.error("[AXIOS] Refresh failed:", refreshErr);
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
