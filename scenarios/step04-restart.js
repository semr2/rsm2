// scenarios/step04-restart.js

const step04 = {
  id: "step04_restart",
  number: 4,

  title: "Restarting the Computer",

  phase: "the-problem",

  objective:
    "Restart the simulated workstation and check whether the report can be recovered.",

  instructions: [
    "Select RESTART COMPUTER to continue the simulated recovery sequence.",
    "The next mission will check whether the report can be opened."
  ],

  environment: {
    scene: "office",
    focus: "monitor"
  },

  interaction: {
    id: "forced_restart",
    type: "button",
    label: "RESTART COMPUTER"
  },

  restartSequence: [
    {
      text: "Restarting..."
    },
    {
      text: "Loading NOVA Desktop..."
    },
    {
      text: "Restoring workspace..."
    }
  ],

  completion: {
    type: "interaction",
    interactionId: "forced_restart"
  }
};

export default step04;
