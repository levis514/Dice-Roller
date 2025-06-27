function getNextFace() {
  const maxFace = faceOptions.length ? Math.max(...faceOptions) : 2;
  let candidate = maxFace + 2;
  while (faceOptions.includes(candidate)) {
    candidate += 2;
  }
  return candidate;
}

function removeFace(index) {
  if (index >= 0 && index < faceOptions.length) {
    faceOptions.splice(index, 1);
    colors.splice(index, 1);
    if (startValue >= faceOptions.length) {
      startValue = faceOptions.length - 1;
    }
    saveSettings();
    renderSettings();
  }
}

function updateColor(index, newColor) {
  if (index >= 0 && index < colors.length) {
    colors[index] = newColor;
    saveSettings();
  }
}

function updateStartValue(newIndex) {
  if (newIndex >= 0 && newIndex < faceOptions.length) {
    startValue = newIndex;
    saveSettings();
    renderStartValue();
  }
}

function renderSettings() {
  renderFaces();

  renderStartValue();

  renderRollSpeed();

  renderCheckOptions();
}

function renderRollSpeed() {
  const option = document.getElementById("rollSpeed");
  option.selectedIndex = rollSpeed;
}

function renderStartValue() {

  const startLabel = document.getElementById("startValueText");
  startLabel.textContent = "Which Dice To Add : ";

  const startValueDisplay = document.getElementById("startValueDisplay");
  startValueDisplay.textContent = faceOptions[startValue] || "";

  const slider = document.getElementById("startValueRange");
  slider.max = faceOptions.length - 1;
  slider.value = startValue;
}

function renderFaces() {
  renderStartValue();

  const diceSettings = document.getElementById("diceSettings");
  diceSettings.innerHTML = "";

  faceOptions.forEach((face, i) => {
    const faceDiv = document.createElement("div");
    faceDiv.className = "face-item";
    faceDiv.style.display = "flex";
    faceDiv.style.alignItems = "center";
    faceDiv.style.gap = "0.6em";

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = colors[i];
    colorPicker.title = `Dice color ${face}`;
    colorPicker.style.marginBottom = "4px";
    colorPicker.addEventListener("input", (e) => {
      updateColor(i, e.target.value);
    });

    const colorContainer = document.createElement("div");
    colorContainer.style.display = "flex";
    colorContainer.style.flexDirection = "column";
    colorContainer.style.alignItems = "center";

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.title = `Delete dice ${face}`;
    delBtn.style.cursor = "pointer";
    delBtn.style.fontSize = "1.4em";
    delBtn.style.padding = "0 6px";
    delBtn.style.border = "none";
    delBtn.style.background = "transparent";
    delBtn.style.color = "#b00";
    delBtn.addEventListener("click", () => removeFace(i));

    colorContainer.appendChild(colorPicker);
    colorContainer.appendChild(delBtn);

    const faceInput = document.createElement("input");
    faceInput.type = "text";
    faceInput.value = face;
    faceInput.style.width = "60px";
    faceInput.style.fontWeight = "bold";
    faceInput.style.fontSize = "1.1em";
    faceInput.style.textAlign = "center";

    faceInput.title = `Change dice face ammount ${face}`;

    faceInput.addEventListener("change", (e) => {
      const val = e.target.value.trim();
      const num = parseInt(val, 10);

      if (
        !isNaN(num) &&
        num > 0 &&
        !faceOptions.some((f, idx) => f === num && idx !== i)
      ) {
        faceOptions[i] = num;
        saveSettings();
        removeFace();
      } else {
        e.target.value = faceOptions[i];
        alert(
          "Dice must be a positive integer."
        );
      }
    });

    faceDiv.appendChild(colorContainer);
    faceDiv.appendChild(faceInput);

    diceSettings.appendChild(faceDiv);
  });
}

function renderCheckOptions() {
  //Monsters checkbox
  const monsterCheckbox = document.getElementById("monsters");
  monsterCheckbox.checked = monster;

  // Delete Enemy checkbox
  const deleteEnemyCheckbox = document.getElementById("deleteEnemy");
  deleteEnemyCheckbox.checked = deleteEnemyOnDeath;

  // Heal Higher Than Max checkbox
  const healHigherThanMaxCheckbox = document.getElementById("healHigherThanMax");
  healHigherThanMaxCheckbox.checked = healHigherThanMax;

  // Splash Divide checkbox
  const splashDivideCheckbox = document.getElementById("splashDivide");
  splashDivideCheckbox.checked = splashDivide;
}

function addFace() {
  const newFace = getNextFace();
  faceOptions.push(newFace);
  colors.push("#888888");
  saveSettings();
  renderFaces();
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  renderSettings();

  document.getElementById("addFaceBtn").addEventListener("click", addFace);
  document.getElementById("startValueRange").addEventListener("input", (e) => {
    updateStartValue(parseInt(e.target.value));
    document.getElementById("startValueDisplay").textContent = faceOptions[startValue] || "";
  });
  document.getElementById("rollSpeed").addEventListener("change", () => {
    rollSpeed = document.getElementById("rollSpeed").selectedIndex;
    saveSettings();
  });
  document.getElementById("monsters").addEventListener("change", (e) => {
    monster = e.target.checked;
    saveSettings();
  });
  document.getElementById("deleteEnemy").addEventListener("change", (e) => {
    deleteEnemyOnDeath = e.target.checked;
    saveSettings();
  });
  document.getElementById("healHigherThanMax").addEventListener("change", (e) => {
    healHigherThanMax = e.target.checked;
    saveSettings();
  });
  document.getElementById("splashDivide").addEventListener("change", (e) => {
    splashDivide = e.target.checked;
    saveSettings();
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    resetSettings();
    loadSettings();
    renderSettings(); 
  });
  document.getElementById("saveBtn").addEventListener("click", () => {
    window.location.href = "../main/dices.html";
  });
});
