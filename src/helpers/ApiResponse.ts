export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });
export const fail = (msg: string): ApiResponse<never> => ({
  success: false,
  error: msg,
});
