// scenarios/step16-debrief.js

const step16 = {
  id: "step16_debrief",
  number: 16,

  title: "Debrief",

  phase: "completion",

  objective:
    "Review the key backup practices demonstrated in the simulation.",

  instructions: [
    "Review the backup lessons from Alice's experience.",
    "Choose the reflection answer that best captures the lesson, then continue to the final assessment."
  ],

  summary: {
    title: "What You Learned",

    points: [
      "Important data should have multiple copies.",
      "Backups should happen regularly.",
      "Automation reduces human error.",
      "The 3-2-1 rule improves resilience.",
      "Backup infrastructure needs protection.",
      "Off-site copies provide additional resilience.",
      "Backups should be tested.",
      "Restore testing verifies recoverability."
    ]
  },

  reflection: {
    prompt:
      "What was the biggest lesson from Alice's experience?",

    options: [
      {
        id: "recovery",
        label: "Recovery is not guaranteed."
      },
      {
        id: "backup",
        label: "Backups need to exist before data is lost."
      },
      {
        id: "testing",
        label: "Backups should be tested."
      }
    ]
  },

  interaction: {
    id: "course_debrief",
    type: "reflection"
  },

  completion: {
    type: "interaction",
    interactionId: "course_debrief"
  }
};
 
export default step16;
