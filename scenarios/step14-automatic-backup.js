// scenarios/step14-automatic-backup.js
const step14 = {
  id: "step14_automatic_backup",
  number: 14,
  title: "Set Up Automatic Backups",
  phase: "long-term-strategy",
  objective: "Understand how a regular backup schedule reduces the risk of losing recent work.",
  instructions: [
    "Review the guidance about backup schedules, versions, and restore testing.",
    "Select ENABLE DAILY BACKUP to continue."
  ],
  lesson: {
    title: "Automate the routine",
    explanation: "A scheduled backup runs consistently without depending on someone remembering to start it.",
    points: [
      "Choose a schedule that matches how often important files change.",
      "Keep backup versions so accidental changes can be recovered.",
      "Check backup status and test restores periodically."
    ]
  },
  interaction: {
    id: "automatic_backup_setup",
    type: "button",
    label: "ENABLE DAILY BACKUP"
  },
  completion: {
    type: "interaction",
    interactionId: "automatic_backup_setup"
  }
};

export default step14;
