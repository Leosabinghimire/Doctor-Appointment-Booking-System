export type ID = string;

export type SortDirection = 'asc' | 'desc';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}
