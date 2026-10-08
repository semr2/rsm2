// scenarios/step15-restore-test.js

const step15 = {
  id: "step15_restore_test",
  number: 15,

  title: "Test the Restore",

  phase: "long-term-strategy",

  objective:
    "Verify that a backup can actually be restored.",

  instructions: [
    "Open the Restore Center.",
    "Choose the Daily Backup and Documents destination, then restore the report."
  ],

  application: "restore-center",

  backup: {
    name: "Daily Backup",
    status: "available"
  },

  restoreTask: {
    prompt:
      "Restore the fictional Quarterly_Budget_Report.xlsx file.",

    source: "Daily Backup",

    target: "Documents",

    filename: "Quarterly_Budget_Report.xlsx"
  },

  interaction: {
    id: "restore_test",
    type: "restore"
  },

  success: {
    title: "RESTORE SUCCESSFUL",

    message:
      "The fictional report has been restored from the simulated backup.",

    lesson:
      "A backup should be tested periodically so you know it can be recovered when needed."
  },

  failure: {
    message:
      "The restore could not be completed. Check the selected backup and restore location."
  },

  completion: {
    type: "interaction",
    interactionId: "restore_test"
  }
};

export default step15;
