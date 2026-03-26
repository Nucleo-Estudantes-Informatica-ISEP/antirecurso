export default interface Pagination<T> {
  data: T[];
  meta: PaginationMetadata;
}

export interface PaginationMetadata {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}
