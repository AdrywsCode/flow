export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function apiError(message: string): ApiError {
  return { success: false, error: { message } };
}
