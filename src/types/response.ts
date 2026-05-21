import type { ISOStringFormat } from "date-fns";

export class ApiError extends Error {
  status?: number;
  timestamp: ISOStringFormat;

  constructor(message: string, status: number, timestamp: ISOStringFormat) {
    super(message);
    this.status = status;
    this.timestamp = timestamp;
  }
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  timestamp: ISOStringFormat;
  data: T;
};

export type GetRegisterSessionReponse = {
  email: string;
};

export type VerifyEmailResponse = {
  session: string;
};
