export interface TableProps<T> {
  data: T[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  sortBy: { key: string; desc: boolean };
  setSortBy: React.Dispatch<
    React.SetStateAction<{
      key: string;
      desc: boolean;
    }>
  >;
  handleOpenModal?: (arg: T) => void;
}
