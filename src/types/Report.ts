export default interface Report {
  id: number;
  user: string;
  reason: string;
  question: {
    id: number;
  };
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  solved: number;
}
