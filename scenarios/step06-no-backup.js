// scenarios/step06-no-backup.js

const step06 = {
  id: "step06_no_backup",
  number: 6,

  title: "No Backup Available",

  phase: "the-problem",

  objective:
    "Understand that backup must exist before data loss occurs.",

  instructions: [
    "Read Alice's update and note that no backup copy is available.",
    "Select CONTACT IT SUPPORT to continue the incident response."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  situation: {
    deadline: "Friday",
    daysRemaining: 4,

    importantFile: "Quarterly_Budget_Report.xlsx",

    backupAvailable: false
  },

  narrative: [
    {
      speaker: "narrator",
      text:
        "There is no known backup copy of the report."
    },
    {
      speaker: "alice",
      text:
        "I need to contact IT. Maybe they can recover it."
    }
  ],

  interaction: {
    id: "seek_it_help",
    type: "button",
    label: "CONTACT IT SUPPORT"
  },

  completion: {
    type: "interaction",
    interactionId: "seek_it_help"
  }
};

export default step06;
