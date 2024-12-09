export interface AdminChartStats {
    exams_per_subject_individual: [
        {
            month: string;
            count: number;
        }
    ];
    
    reports_per_month: [
        {
            month: string;
            count: number;
        }
    ];
  
    comments_per_month: [
        {
            month: string;
            count: number;
        }
    ];

    users_per_month: [
        {
            month: string;
            count: number;
        }
    ];
}