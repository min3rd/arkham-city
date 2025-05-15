export interface ApiResponse<T> {
  timestamp: string;
  data: T;
  error: boolean;
}
