// scenarios/step10-backup-lesson.js

const step10 = {
  id: "step10_backup_lesson",
  number: 10,

  title: "A Hard Lesson",

  phase: "immediate-action",

  objective:
    "Understand why important data should have reliable backups before an incident occurs.",

  instructions: [
    "Review each lesson about backup timing, multiple copies, and recovery.",
    "Select CONTINUE when you are ready to plan a backup."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  lesson: {
    title: "The Lesson",

    points: [
      {
        title: "Backups must exist before data loss.",
        explanation:
          "A backup cannot help if it was never created."
      },

      {
        title: "One copy is fragile.",
        explanation:
          "If the only copy becomes corrupted or unavailable, the data may be lost."
      },

      {
        title: "Recovery is not guaranteed.",
        explanation:
          "Trying to recover a damaged file is not the same as restoring a known-good backup."
      }
    ]
  },

  interaction: {
    id: "backup_lesson",
    type: "continue",
    label: "CONTINUE"
  },

  completion: {
    type: "interaction",
    interactionId: "backup_lesson"
  }
};

export default step10;
