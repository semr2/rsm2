// scenarios/step13-backup-security.js

const step13 = {
  id: "step13_backup_security",
  number: 13,

  title: "Recognizing Vulnerable Configurations",

  phase: "long-term-strategy",

  objective:
    "Recognize that backup infrastructure can also be exposed to threats.",

  instructions: [
    "Select every configuration that creates additional backup risk.",
    "Submit your selection to review the feedback."
  ],

  lesson: {
    explanation:
      "A backup is only useful if it remains available when the original data is unavailable."
  },

  challenge: {
    prompt:
      "Which backup configurations create additional risk?",

    configurations: [
      {
        id: "always_connected_drive",

        title: "Always-connected backup drive",

        description:
          "The backup drive remains permanently connected to the computer.",

        risk: true,

        feedback:
          "If the computer is compromised, the connected backup may also be affected."
      },

      {
        id: "offsite_copy",

        title: "Protected off-site copy",

        description:
          "A separate copy is maintained away from the primary environment.",

        risk: false,

        feedback:
          "An off-site copy adds resilience."
      },

      {
        id: "unprotected_nas",

        title: "Poorly protected network storage",

        description:
          "Backup storage is exposed without appropriate protection.",

        risk: true,

        feedback:
          "Backup infrastructure can itself become a target."
      },

      {
        id: "tested_backup",

        title: "Protected and regularly tested backup",

        description:
          "Backups are protected and periodically restored to verify recovery.",

        risk: false,

        feedback:
          "Testing helps verify that the backup can actually be restored."
      }
    ]
  },

  interaction: {
    id: "backup_risk_identification",
    type: "multi-select"
  },

  completion: {
    type: "interaction",
    interactionId: "backup_risk_identification"
  }
};

export default step13;
