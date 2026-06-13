export type ApiResponse<TData = object> = {
  success: boolean;
  data?: TData;
  error?: {
    message: string;
    details?: string;
  };
};

export const apiResponse = (data: ApiResponse) => data;
