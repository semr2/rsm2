// scenarios/step12-321-rule.js

const step12 = {
  id: "step12_321_rule",
  number: 12,

  title: "The 3-2-1 Rule",

  phase: "long-term-strategy",

  objective:
    "Understand how the 3-2-1 rule improves backup resilience.",

  instructions: [
    "Select the three statements that match the 3-2-1 rule.",
    "Submit your selection to see feedback."
  ],

  lesson: {
    title: "The 3-2-1 Backup Rule",

    explanation:
      "A resilient backup strategy keeps multiple copies of important data across different types of storage, including an off-site copy.",

    components: [
      {
        id: "three",
        number: 3,
        label: "COPIES",
        description:
          "Keep at least three copies of important data."
      },

      {
        id: "two",
        number: 2,
        label: "MEDIA TYPES",
        description:
          "Use at least two different types of storage."
      },

      {
        id: "one",
        number: 1,
        label: "OFF-SITE",
        description:
          "Keep at least one copy away from the primary location."
      }
    ]
  },

  challenge: {
    type: "sequence",

    prompt:
      "Select the three principles that make up the 3-2-1 rule.",

    options: [
      "3 copies",
      "2 storage types",
      "1 off-site copy",
      "1 copy",
      "2 passwords",
      "3 administrators"
    ],

    correct: [
      "3 copies",
      "2 storage types",
      "1 off-site copy"
    ]
  },

  interaction: {
    id: "backup_321_rule",
    type: "challenge"
  },

  completion: {
    type: "interaction",
    interactionId: "backup_321_rule"
  }
};

export default step12;
