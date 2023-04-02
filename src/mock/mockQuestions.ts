export interface Question {
  question: string;
  exam: string;
  question_type: {
    name: string;
  };
  options: {
    order: number;
    name: string;
  }[];
}

export const mockQuestions: Question[] = [
  {
    question: 'Which of the following is not a type of inheritance?',
    exam: 'Java',
    question_type: {
      name: 'Multiple Choice'
    },
    options: [
      {
        order: 1,
        name: 'Single'
      },
      {
        order: 2,
        name: 'Multiple'
      },
      {
        order: 3,
        name: 'Multilevel'
      },
      {
        order: 4,
        name: 'Hierarchical'
      }
    ]
  },
  {
    question: 'Which of the following is not a type of inheritance?',
    exam: 'Java',
    question_type: {
      name: 'Multiple Choice'
    },
    options: [
      {
        order: 1,
        name: 'Single'
      },
      {
        order: 2,

        name: 'Multiple'
      },
      {
        order: 3,
        name: 'Multilevel'
      },
      {
        order: 4,

        name: 'Hierarchical'
      }
    ]
  }
];
