export interface Pagination<T> {
  query: object;
  sort: string[];
  page: number;
  size: number;
  total: number;
  data: T[];
}
