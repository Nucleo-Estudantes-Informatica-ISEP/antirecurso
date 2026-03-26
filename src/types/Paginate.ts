import type { PaginationMetadata } from '@/types/Pagination';

export interface Paginate<T> {
  data: T[];
  meta: PaginationMetadata;
}
