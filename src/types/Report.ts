export default interface Report {
  id: number;
  user: string;
  email: string;
  reason: string;
  question: {
    id: number;
    title: string;
    exam: string;
    correct_option: string;
    options:{
      name: string;
      order: string;
    }[];
  };
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: {
    name: string;
    email: string;
  } | null;
  solved: number;
}
