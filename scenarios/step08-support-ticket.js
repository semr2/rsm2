// scenarios/step08-support-ticket.js

const step08 = {
  id: "step08_support_ticket",
  number: 8,

  title: "Submitting the Support Ticket",

  phase: "the-problem",

  objective:
    "Provide IT with enough information to understand the simulated incident.",

  instructions: [
    "Complete each ticket field with the details that match Alice's incident.",
    "Select SUBMIT TICKET and review the ticket confirmation."
  ],

  application: "support-portal",

  ticket: {
    fields: [
      {
        id: "incident_type",
        label: "Incident Type",
        type: "select",

        options: [
          "System crashed",
          "Application error",
          "Network problem"
        ],

        correct: "System crashed"
      },

      {
        id: "description",
        label: "Description",
        type: "select",

        options: [
          "Budget spreadsheet became corrupted",
          "Printer stopped working",
          "Email is unavailable"
        ],

        correct: "Budget spreadsheet became corrupted"
      },

      {
        id: "recovery",
        label: "Recovery",
        type: "select",

        options: [
          "Automatic recovery failed",
          "Recovery succeeded"
        ],

        correct: "Automatic recovery failed"
      },

      {
        id: "backup",
        label: "Backup",
        type: "select",

        options: [
          "A backup exists",
          "No backup copy is available"
        ],

        correct: "No backup copy is available"
      },

      {
        id: "deadline",
        label: "Business Impact",
        type: "select",

        options: [
          "Report deadline is Friday",
          "No deadline"
        ],

        correct: "Report deadline is Friday"
      }
    ]
  },

  submit: {
    label: "SUBMIT TICKET"
  },

  success: {
    message: "Ticket submitted successfully.",
    ticketId: "NS-TRAIN-1042"
  },

  interaction: {
    id: "support_ticket",
    type: "form"
  },

  completion: {
    type: "interaction",
    interactionId: "support_ticket"
  }
};

export default step08;
