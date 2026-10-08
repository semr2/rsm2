// scenarios/step02-quarterly-report.js

const step02 = {
  id: "step02_quarterly_report",
  number: 2,

  title: "Working on the Report",

  phase: "the-problem",

  objective:
    "Open Alice's quarterly budget report.",

  instructions: [
    "Choose OPEN FILE MANAGER.",
    "Open Documents, then select Quarterly_Budget_Report.xlsx to inspect it."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  application: "file-manager",

  task: {
    type: "open-file",

    path: [
      "Documents"
    ],

    filename: "Quarterly_Budget_Report.xlsx"
  },

  simulatedFile: {
    name: "Quarterly_Budget_Report.xlsx",
    type: "spreadsheet",

    contents: [
      "Q4 Budget Forecast",
      "Revenue",
      "Expenses",
      "Projected Growth",
      "Client Allocation",
      "Quarterly Forecast"
    ]
  },

  interaction: {
    id: "budget_file_open",
    type: "file",
    target: "Quarterly_Budget_Report.xlsx"
  },

  feedback: {
    success:
      "The quarterly budget report is open."
  },

  completion: {
    type: "interaction",
    interactionId: "budget_file_open"
  }
};

export default step02;
