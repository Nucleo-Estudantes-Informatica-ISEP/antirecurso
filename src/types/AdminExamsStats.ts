export interface AdminExamsStats {
  exams_per_day: [
    {
      date: string;
      count: number;
    }
  ];
  exams_per_subject: [
    {
      name: string;
      count: number;
    }
  ];
  exams_per_mode: [
    {
      mode: string;
      count: number;
    }
  ];
}
