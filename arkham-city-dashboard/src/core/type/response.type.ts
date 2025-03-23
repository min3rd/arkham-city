export interface Response<T> {
  timestamp: string;
  data: T;
  error: boolean;
}
