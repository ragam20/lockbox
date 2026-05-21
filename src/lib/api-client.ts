import { env } from "@/config/env";
import { ApiError } from "@/types/response";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "./auth";
import { paths } from "@/config/paths";

const axioBaseConfig = {
  baseURL: env.API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const privateApi = axios.create(axioBaseConfig);
export const publicApi = axios.create(axioBaseConfig);

publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || "";
    const timestamp = err.response?.data?.timestamp || "";

    return Promise.reject(new ApiError(message, status, timestamp));
  },
);

privateApi.interceptors.response.use(
  function (response) {
    return response;
  },
  function (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message || "";
    const timestamp = err.response?.data?.timestamp || "";

    return Promise.reject(new ApiError(message, status, timestamp));
  },
);

let refreshPromise: Promise<void> | null = null;

privateApi.interceptors.response.use(
  (resp) => resp.data,
  async (err: AxiosError) => {
    const status = err.response?.status;

    const originalRequest = err.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(err);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshToken().finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;

        return privateApi(originalRequest);
      } catch (err) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo =
          searchParams.get("redirectTo") || window.location.pathname;

        if (!window.location.pathname.startsWith(paths.auth.login.path)) {
          window.location.href = paths.auth.login.getHref(redirectTo);
        }

        return Promise.reject(err);
      }
    }
  },
);
