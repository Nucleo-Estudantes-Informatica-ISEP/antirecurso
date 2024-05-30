export default interface PreviousExamResponseMetadata {
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
}
