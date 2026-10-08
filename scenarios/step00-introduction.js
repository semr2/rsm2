// scenarios/step00-introduction.js

const step00 = {
  id: "step00_introduction",
  number: 0,

  title: "Introduction",

  phase: "introduction",

  objective:
    "Take a quick look around Alice's office before beginning the simulation.",

  environment: {
    scene: "office",
    focus: "establish"
  },

  narrative: [
    {
      speaker: "narrator",
      text:
        "Welcome to the Backup Best Practices simulation."
    },
    {
      speaker: "narrator",
      text:
        "You will experience what can happen when important work exists in only one place."
    },
    {
      speaker: "narrator",
      text:
        "You will then learn how reliable backups can reduce the impact of data loss."
    }
  ],

  tour: [
    {
      title: "1 · Look around the office",
      text: "Take in the whole room. In 3D, drag empty space to orbit around the office, scroll to zoom, and use the arrow keys to change your view. Press Home to reset the camera. In 2D, the office view stays fixed."
    },
    {
      title: "2 · Try the movable objects",
      text: "Drag a chair or recycling bin to move it. In the 2D view, you can also focus an object and use the arrow keys. These are optional practice interactions."
    },
    {
      title: "3 · Enter the first mission",
      text: "The introduction is complete. Next you will enter Mission 1: A Productive Morning. Read each mission prompt, use its on-screen buttons or app to complete the activity, then choose CONTINUE to move forward. Your course progress is saved as you go."
    }
  ],

  interaction: {
    type: "button",
    id: "start_simulation",
    label: "BEGIN MISSION 1"
  },

  completion: {
    type: "interaction",
    interactionId: "step00_start"
  },

};

export default step00;
