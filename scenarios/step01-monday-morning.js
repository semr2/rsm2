// scenarios/step01-monday-morning.js

const step01 = {
  id: "step01_monday_morning",
  number: 1,

  title: "A Productive Morning",

  phase: "the-problem",

  objective:
    "Recognize the value and importance of the work being created.",

  instructions: [
    "Read the short story about Alice's report and what it contains.",
    "Select CONTINUE when you are ready for the next mission."
  ],

  environment: {
    scene: "office",
    focus: "desk"
  },

  narrative: [
    {
      speaker: "narrator",
      text:
        "It is Monday morning at Northstar Dynamics."
    },
    {
      speaker: "alice",
      text:
        "I need to finish this quarterly report before Friday."
    },
    {
      speaker: "narrator",
      text:
        "Alice has spent approximately three weeks preparing the report."
    }
  ],

  facts: [
    "Financial projections",
    "Client data",
    "Charts",
    "Detailed analysis"
  ],

  interaction: {
    type: "button",
    id: "step01_continue",
    label: "CONTINUE"
  },

  completion: {
    type: "interaction",
    interactionId: "step01_intro"
  }
};

export default step01;
