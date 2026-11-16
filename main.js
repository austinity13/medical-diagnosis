let currentCase = null;
let stageIndex = 0;
let score = 0;
let vitals = {};
let isTransitioning = false;

const stageTitle = document.getElementById("stage-title");
const content = document.getElementById("content");
const result = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");

function renderCaseSelect() {
  stageTitle.textContent = "Select a Case";
  content.innerHTML = "";
  result.textContent = "";
  nextBtn.style.display = "none";

  CASES.forEach(c => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = `${c.name} (${c.difficulty})`;
    div.onclick = () => startCase(c);
    content.appendChild(div);
  });
}

function startCase(c) {
  currentCase = c;
  stageIndex = 0;
  score = 0;
  vitals = { ...c.vitals };
  isTransitioning = false;
  renderStage();
}

function renderVitals() {
  let v = document.getElementById("vitals-box");
  if (!v) {
    v = document.createElement("div");
    v.id = "vitals-box";
    content.prepend(v);
  }
  v.innerHTML = `<strong>Vitals:</strong><br>
    HR: ${vitals.HR} bpm | BP: ${vitals.BP} | O2: ${vitals.O2}% | Temp: ${vitals.Temp.toFixed(1)}°F`;
}

function renderStage() {
  if (stageIndex >= currentCase.stages.length) {
    return endCase();
  }

  isTransitioning = false;
  content.innerHTML = "";
  result.textContent = "";
  const stage = currentCase.stages[stageIndex];
  stageTitle.textContent = stage.title;
  renderVitals();

  if (stage.type === "info") {
    nextBtn.style.display = "block";
    const p = document.createElement("p");
    p.textContent = stage.text;
    content.appendChild(p);
  }

  if (stage.type === "choice") {
    nextBtn.style.display = "none";
    stage.options.forEach(opt => {
      const div = document.createElement("div");
      div.className = "option";
      div.textContent = opt.text;
      div.onclick = () => handleChoice(opt);
      content.appendChild(div);
    });
  }
}

function applyEffects(effect) {
  if (!effect) return;
  for (const key in effect) {
    if (vitals[key] !== undefined && typeof vitals[key] === "number") {
      vitals[key] += effect[key];
    }
  }
  renderVitals();
}

function handleChoice(option) {
  if (isTransitioning) return;

  applyEffects(option.effect);

  if (option.correct) {
    isTransitioning = true;
    score++;
    result.textContent = "Correct";
    result.style.color = "green";
    stageIndex = option.next !== undefined ? option.next : stageIndex + 1;
    setTimeout(renderStage, 700);
  } else {
    result.textContent = option.feedback || "Incorrect. Try again.";
    result.style.color = "red";
    if (option.fail) {
      isTransitioning = true;
      setTimeout(() => endCase("Patient condition worsened."), 700);
    }
  }
}

nextBtn.onclick = () => {
  stageIndex++;
  if (stageIndex >= currentCase.stages.length) {
    endCase();
  } else {
    renderStage();
  }
};

function endCase(extra = "") {
  content.innerHTML = "";
  nextBtn.style.display = "none";
  stageTitle.textContent = "Case Complete";

  const totalQuestions = currentCase.stages.filter(s => s.type === "choice").length;
  result.style.color = "#222";
  result.innerHTML = `${extra ? `<strong style="color:red;">${extra}</strong><br><br>` : ""}
    <strong>Score:</strong> ${score} / ${totalQuestions}<br>
    <strong>Diagnosis:</strong> ${currentCase.final.diagnosis}<br>
    <strong>Explanation:</strong> ${currentCase.final.explanation}`;

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Back to Case Selection";
  restartBtn.onclick = renderCaseSelect;
  content.appendChild(restartBtn);
}

renderCaseSelect();