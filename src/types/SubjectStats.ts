export interface SubjectStats {
  n_of_answers: number;
  n_of_answered: number;
  total_of_questions: number;
  n_of_wrong_answers: number;
  n_of_correct: number;
  n_of_exams_taken: number;
  n_of_exams_passed: number;
  user_scores: {
    score: number;
    created_at: string;
  }[];
  exam_weight: number;
  min_grade: number;
  average_grade: number;
  percentage_of_exams_passed: number;
  percentage_of_correct_answers: number;
  percentage_of_questions_seen: number;
  mode_scores: Record<string, number>;
  suggested_mode: string;
  times: { time: number | null }[];
  mean_time: number | null;
  place_in_scoreboard: number | null;
}
