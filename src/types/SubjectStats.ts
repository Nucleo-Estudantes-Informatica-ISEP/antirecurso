export default interface SubjectStats {
  n_of_answers: number;
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
  average_grade: string;
  percentage_of_exams_passed: string;
  percentage_of_correct_answers: string;
  percentage_of_questions_seen: string;
  mode_scores: {
    random: number;
    new: number;
    realistic: number;
    wrong: number;
    hard: number;
    custom: number;
  };
  suggested_mode: string;
  times: number[];
  mean_time: number;
  place_in_scoreboard: number | null;
}
