let currentCase = null;
let stageIndex = 0;
let score = 0;
let vitals = {};

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
    let div = document.createElement("div");
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
  nextBtn.style.display = "block";
  renderStage();
}

function renderVitals() {
  let v = document.createElement("div");
  v.innerHTML = `<strong>Vitals:</strong><br>
    HR: ${vitals.HR} | BP: ${vitals.BP} | O2: ${vitals.O2}% | Temp: ${vitals.Temp}`;
  content.appendChild(v);
}

function renderStage() {
  content.innerHTML = "";
  result.textContent = "";
  const stage = currentCase.stages[stageIndex];
  stageTitle.textContent = stage.title;
  renderVitals();

  if (stage.type === "info") {
    let p = document.createElement("p");
    p.textContent = stage.text;
    content.appendChild(p);
  }

  if (stage.type === "choice") {
    stage.options.forEach(opt => {
      let div = document.createElement("div");
      div.className = "option";
      div.textContent = opt.text;
      div.onclick = () => handleChoice(opt);
      content.appendChild(div);
    });
  }
}

function applyEffects(effect) {
  if (!effect) return;
  for (let key in effect) {
    if (vitals[key] !== undefined) {
      vitals[key] += effect[key];
    }
  }
}

function handleChoice(option) {
  applyEffects(option.effect);

  if (option.correct) {
    score++;
    result.textContent = "Correct";
    result.style.color = "green";
  } else {
    result.textContent = option.feedback || "Incorrect";
    result.style.color = "red";
    if (option.fail) return endCase("Patient condition worsened.");
    return;
  }

  stageIndex = option.next !== undefined ? option.next : stageIndex + 1;
  setTimeout(renderStage, 700);
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
  stageTitle.textContent = "Case Complete";
  result.innerHTML = `${extra}<br><br>
    Score: ${score} / ${currentCase.stages.length}<br>
    Diagnosis: ${currentCase.final.diagnosis}<br>
    Explanation: ${currentCase.final.explanation}`;
}

renderCaseSelect();