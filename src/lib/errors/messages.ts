export const errorMessages = {
  AUTH_INVALID_CREDENTIAL: "Kredensial login tidak valid.",
  AUTH_EMAIL_ALREADY_EXISTS: "Email ini sudah terdaftar.",
  AUTH_USER_NOT_FOUND: "Pengguna tidak ditemukan.",
  AUTH_FAILED_REGISTER: "Pendaftaran akun gagal.",
  AUTH_INVALID_VERIFICATION: "Kode verifikasi tidak valid.",
  AUTH_UNAUTHORIZED: "Anda tidak memiliki akses.",
  AUTH_TOKEN_EXPIRED: "Sesi login sudah kedaluwarsa.",
  AUTH_INVALID_TOKEN: "Token autentikasi tidak valid.",
  AUTH_SESSION_REQUIRED: "Sesi login diperlukan.",
  AUTH_SESSION_EXPIRED: "Sesi login sudah kedaluwarsa.",
  AUTH_FIELD_EMAIL_REQUIRED: "Email wajib diisi.",
  AUTH_FIELD_PASSWORD_REQUIRED: "Password wajib diisi.",
  AUTH_FIELD_NAME_REQUIRED: "Nama wajib diisi.",
  AUTH_INVALID_VALIDATION: "Data yang dikirim tidak valid.",
  AUTH_INVALID_OTP: "OTP tidak valid.",

  USER_NOT_FOUND: "Pengguna tidak ditemukan.",

  VAULT_INVALID_TYPE: "Tipe vault tidak valid.",
  VAULT_NOT_FOUND: "Vault tidak ditemukan.",
  VAULT_ID_REQUIRED: "ID vault wajib diisi.",
  VAULT_FIELD_TITLE_REQUIRED: "Judul vault wajib diisi.",
  VAULT_INVALID_VALIDATION: "Data vault yang dikirim tidak valid.",

  NETWORK_ERROR: "Koneksi bermasalah. Coba lagi.",
} as const;

export type ErrorCode = keyof typeof errorMessages;

export const getErrorMessage = (
  code: string,
  fallbackMessage = "Terjadi kesalahan. Silakan coba lagi.",
) => {
  if (code in errorMessages) {
    return errorMessages[code as ErrorCode];
  }

  return fallbackMessage;
};
