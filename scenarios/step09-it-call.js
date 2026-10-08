// scenarios/step09-it-call.js

const step09 = {
  id: "step09_it_call",
  number: 9,

  title: "The IT Call",

  phase: "the-problem",

  objective:
    "Understand that data recovery is not guaranteed when reliable backups do not exist.",

  instructions: [
    "Read the conversation between Alice and IT Support.",
    "Select CONTINUE after reviewing why recovery cannot be guaranteed."
  ],

  environment: {
    scene: "office",
    focus: "phone"
  },

  call: {
    caller: "James",
    role: "IT Support",

    dialogue: [
      {
        speaker: "James",
        text:
          "Hi Alice. I received your support ticket."
      },
      {
        speaker: "Alice",
        text:
          "Is there any way to recover the report?"
      },
      {
        speaker: "James",
        text:
          "We can try, but recovery is not guaranteed."
      },
      {
        speaker: "James",
        text:
          "The bigger issue is that there does not appear to be another copy of the file."
      }
    ]
  },

  interaction: {
    id: "it_call",
    type: "dialogue"
  },

  completion: {
    type: "interaction",
    interactionId: "it_call"
  }
};

export default step09;
