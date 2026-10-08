// scenarios/step17-quiz.js

const step17 = {
  id: "step17_quiz",
  number: 17,

  title: "Final Assessment",

  phase: "assessment",

  objective:
    "Demonstrate understanding of backup best practices.",

  instructions: [
    "Answer each question by selecting one option.",
    "Review the feedback after each answer. A score of 80% is required to pass."
  ],

  assessment: {
    id: "backup_best_practices_quiz",

    passingScore: 80,

    questions: [
      {
        id: "quiz_question_1",

        question:
          "Why is keeping only one copy of important data risky?",

        options: [
          {
            id: "a",
            text: "The file takes longer to open."
          },
          {
            id: "b",
            text: "A single copy can become unavailable or corrupted.",
            correct: true
          },
          {
            id: "c",
            text: "The computer will automatically delete it."
          }
        ]
      },

      {
        id: "quiz_question_2",

        question:
          "What does the 3-2-1 rule recommend?",

        options: [
          {
            id: "a",
            text: "3 passwords, 2 users, 1 computer."
          },
          {
            id: "b",
            text: "3 copies, 2 storage types, 1 off-site copy.",
            correct: true
          },
          {
            id: "c",
            text: "3 backups every 2 hours."
          }
        ]
      },

      {
        id: "quiz_question_3",

        question:
          "Why are automatic backups useful?",

        options: [
          {
            id: "a",
            text: "They reduce dependence on remembering to back up manually.",
            correct: true
          },
          {
            id: "b",
            text: "They guarantee that no file can ever be lost."
          },
          {
            id: "c",
            text: "They eliminate the need for testing."
          }
        ]
      },

      {
        id: "quiz_question_4",

        question:
          "Why can an always-connected backup drive be risky?",

        options: [
          {
            id: "a",
            text: "It may be affected if the computer is compromised.",
            correct: true
          },
          {
            id: "b",
            text: "It cannot store files."
          },
          {
            id: "c",
            text: "It automatically deletes old backups."
          }
        ]
      },

      {
        id: "quiz_question_5",

        question:
          "Why should backups be tested?",

        options: [
          {
            id: "a",
            text: "To make the backup larger."
          },
          {
            id: "b",
            text: "To verify that data can actually be restored.",
            correct: true
          },
          {
            id: "c",
            text: "To replace the original files."
          }
        ]
      },

      {
        id: "quiz_question_6",

        question:
          "When should a backup exist?",

        options: [
          {
            id: "a",
            text: "After the original data is lost."
          },
          {
            id: "b",
            text: "Before data loss occurs.",
            correct: true
          },
          {
            id: "c",
            text: "Only when IT requests one."
          }
        ]
      }
    ]
  },

  interactionIds: [
    "quiz_question_1",
    "quiz_question_2",
    "quiz_question_3",
    "quiz_question_4",
    "quiz_question_5",
    "quiz_question_6"
  ],

  completion: {
    type: "assessment",
    assessmentId: "backup_best_practices_quiz"
  }
};

export default step17;
