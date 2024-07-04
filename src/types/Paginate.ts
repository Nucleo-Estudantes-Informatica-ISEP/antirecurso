export interface Paginate<T> {
  data: T[];
  meta: {
    current_page: number;
    path: string;
    from: number;
    per_page: number;
    to: number;
    total: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  total: number;
}
