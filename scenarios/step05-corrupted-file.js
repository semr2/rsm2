// scenarios/step05-corrupted-file.js

const step05 = {
  id: "step05_corrupted_file",
  number: 5,

  title: "The Devastating Discovery",

  phase: "the-problem",

  objective:
    "Recognize the risk of having only one copy of important data.",

  instructions: [
    "Open the Documents folder and select Quarterly_Budget_Report.xlsx.",
    "When the file error appears, choose TRY RECOVERY or CANCEL and review the result."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  application: "file-manager",

  targetFile: {
    path: ["Documents"],
    name: "Quarterly_Budget_Report.xlsx"
  },

  error: {
    title: "FILE ERROR",

    message:
      "The file cannot be opened.",

    details:
      "The file appears to be corrupted.",

    recovery:
      "Automatic recovery was unsuccessful."
  },

  choices: [
    {
      id: "try_recovery",
      label: "TRY RECOVERY",

      outcome: {
        type: "failure",
        message:
          "Recovery unsuccessful. No backup copy found."
      }
    },

    {
      id: "cancel",
      label: "CANCEL",

      outcome: {
        type: "continue"
      }
    }
  ],

  lesson: {
    title: "DATA-LOSS RISK",

    points: [
      "ONE COPY",
      "NO BACKUP",
      "HIGH DATA-LOSS RISK"
    ]
  },

  interaction: {
    id: "data_loss_discovery",
    type: "choice"
  },

  completion: {
    type: "interaction",
    interactionId: "data_loss_discovery"
  }
};

export default step05;
