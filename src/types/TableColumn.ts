export interface TableColumn<T> {
  name: string;
  key: keyof T;
  w: string;
}
