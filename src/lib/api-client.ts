import { env } from "@/config/env";
import { ApiError } from "@/types/response";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getErrorMessage } from "./errors/messages";
import { paths } from "@/config/paths";
import type { ISOStringFormat } from "date-fns";

const axiosBaseConfig = {
  baseURL: env.API_URL,
  timeout: 5500,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const privateApi = axios.create(axiosBaseConfig);
export const publicApi = axios.create(axiosBaseConfig);

publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (!err.response) {
      return Promise.reject(
        new ApiError(
          "NETWORK_ERROR",
          getErrorMessage("NETWORK_ERROR", "Network error"),
          0,
          new Date().toISOString() as ISOStringFormat,
        ),
      );
    }
    const code = err.response?.data.code || "";
    const status = err.response?.status;
    const message = err.response?.data?.message || "";
    const timestamp = err.response?.data?.timestamp || "";

    return Promise.reject(
      new ApiError(code, getErrorMessage(code, message), status, timestamp),
    );
  },
);

let refreshPromise: Promise<void> | null = null;

const isAuthRoute = (pathname: string) => {
  return (
    pathname === paths.auth.root.path ||
    pathname.startsWith(`${paths.auth.root.path}/`)
  );
};

privateApi.interceptors.response.use(
  (response) => response.data,
  async (err: AxiosError) => {
    const status = err.response?.status;

    const originalRequest = err.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = publicApi
            .post("/auth/refresh-token")
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return privateApi(originalRequest);
      } catch (refreshErr) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo =
          searchParams.get("redirectTo") || window.location.pathname;
        const currentPath = window.location.pathname;

        if (!isAuthRoute(currentPath)) {
          window.location.href = paths.auth.otp.getHref(redirectTo);
        }

        return Promise.reject(refreshErr);
      }
    }

    const code = err.response?.data?.code || "";
    const statusCode = err.response?.status || 0;
    const message = err.response?.data?.message || "";
    const timestamp = err.response?.data?.timestamp || "";

    return Promise.reject(
      new ApiError(code, getErrorMessage(code, message), statusCode, timestamp),
    );
  },
);
