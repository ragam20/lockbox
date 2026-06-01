import type { ISOStringFormat } from "date-fns";

export class ApiError extends Error {
  status?: number;
  code: string;
  timestamp: ISOStringFormat;

  constructor(
    code: string,
    message: string,
    status: number,
    timestamp: ISOStringFormat,
  ) {
    super(message);

    this.name = "ApiError";

    this.code = code;
    this.status = status;
    this.timestamp = timestamp;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  timestamp: ISOStringFormat;
  data: T;
};

export type PaginationResponse<T> = {
  success: boolean;
  message: string;
  timestamp: ISOStringFormat;
  data: T;
  meta: PaginationMeta;
};

export type GetRegisterSessionReponse = {
  email: string;
};

export type VerifyEmailResponse = {
  session: string;
};

export type RequestOtpResponse = {
  expiresIn: number;
};

export type VerifyOtpResponse = {
  email: string;
  isVerified: boolean;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
