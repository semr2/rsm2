// scenarios/step11-backup-setup.js

const step11 = {
  id: "step11_backup_setup",
  number: 11,

  title: "Connect the External SSD",

  phase: "immediate-action",

  objective:
    "Create a simulated backup destination.",

  instructions: [
    "Review the external SSD details.",
    "Select CONNECT EXTERNAL SSD to continue with the backup setup."
  ],

  environment: {
    scene: "office",
    focus: "external-ssd"
  },

  storage: {
    id: "external_ssd",
    label: "External SSD",

    capacity: "1 TB",

    available: true,

    simulated: true
  },

  interaction: {
    id: "ssd_connect",
    type: "connect-storage",

    target: "external_ssd",

    label: "CONNECT EXTERNAL SSD"
  },

  feedback: {
    success:
      "External SSD connected to the simulated workstation."
  },

  completion: {
    type: "interaction",
    interactionId: "ssd_connect"
  }
};

export default step11;
