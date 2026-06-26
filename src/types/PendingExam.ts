export default interface PendingExam {
  id: number;
  subject: string;
  subject_id: number;
  mode: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
