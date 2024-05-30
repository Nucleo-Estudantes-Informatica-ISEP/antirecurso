export default interface Pagination<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: PaginationMetadata;
}

export interface PaginationMetadata {
  path: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  current_page: number;
  last_page: number;
  per_page: number;
  to: number;
  from: number;
  total: number;
}
