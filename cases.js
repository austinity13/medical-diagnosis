const CASES = [
  {
    id: 1,
    name: "Respiratory Infection",
    difficulty: "Easy",
    vitals: { HR: 110, BP: "100/65", O2: 92, Temp: 101.5 },
    stages: [
      {
        type: "info",
        title: "History",
        text: "25-year-old with fever, cough, chest pain, shortness of breath."
      },
      {
        type: "choice",
        title: "Next Step",
        options: [
          { text: "Order chest X-ray", correct: true, next: 2, effect: { O2: 2 } },
          { text: "Send home", correct: false, feedback: "Patient worsens at home.", effect: { O2: -5, HR: 10 }, fail: true }
        ]
      },
      {
        type: "info",
        title: "Results",
        text: "X-ray shows lung consolidation."
      },
      {
        type: "choice",
        title: "Diagnosis",
        options: [
          { text: "Cold", correct: false },
          { text: "Pneumonia", correct: true },
          { text: "Asthma", correct: false }
        ]
      },
      {
        type: "choice",
        title: "Treatment",
        options: [
          { text: "Antibiotics", correct: true, effect: { Temp: -2, HR: -10 } },
          { text: "Ignore", correct: false, effect: { O2: -10 }, fail: true }
        ]
      }
    ],
    final: {
      diagnosis: "Pneumonia",
      explanation: "Infection confirmed via imaging."
    }
  }
];