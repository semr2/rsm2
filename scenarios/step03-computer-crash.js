// scenarios/step03-computer-crash.js

const step03 = {
  id: "step03_computer_crash",
  number: 3,

  title: "The Crash",

  phase: "the-problem",

  objective:
    "Recognize that unexpected system failures can interrupt work and threaten unsaved data.",

  instructions: [
    "Read the system failure message and consider what may happen to unsaved work.",
    "Select CONTINUE to move to the restart activity."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  sequence: [
    {
      type: "visual",
      action: "screen_flicker",
      duration: 500
    },
    {
      type: "visual",
      action: "screen_dark",
      duration: 800
    },
    {
      type: "ui",
      action: "show-crash-screen"
    }
  ],

  crashScreen: {
    title: "NOVA Desktop",
    message: "The system encountered an unexpected problem.",
    action: "RESTART COMPUTER"
  },

  interaction: {
    id: "system_crash",
    type: "crash"
  },

  completion: {
    type: "interaction",
    interactionId: "system_crash"
  }
};

export default step03;
