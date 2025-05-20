export interface IPagination<T> {
  query: object;
  sort: string[];
  page: number;
  size: number;
  total: number;
  data: T[];
}

export class Pagination<T> implements IPagination<T> {
  query: object;
  sort: string[];
  page: number;
  size: number;
  total: number;
  data: T[];

  constructor(
    query: object,
    sort: string[],
    page: number,
    size: number,
    total: number,
    data: T[],
  ) {
    this.query = query;
    this.sort = sort;
    this.page = page;
    this.size = size;
    this.total = total;
    this.data = data;
  }
}
