// scenarios/step07-contact-it.js

const step07 = {
  id: "step07_contact_it",
  number: 7,

  title: "Contacting IT Support",

  phase: "the-problem",

  objective:
    "Use the simulated support portal to request assistance.",

  instructions: [
    "Choose the category System Failure / Data Recovery.",
    "Submit the request and review the confirmation."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  application: "support-portal",

  portal: {
    organization: "Northstar IT Support",

    form: {
      title: "Create Support Request",

      category: {
        options: [
          "Hardware Problem",
          "Software Problem",
          "System Failure / Data Recovery",
          "Account Problem"
        ],

        correct: "System Failure / Data Recovery"
      }
    }
  },

  interaction: {
    id: "open_support_portal",
    type: "form"
  },

  completion: {
    type: "interaction",
    interactionId: "open_support_portal"
  }
};

export default step07;
