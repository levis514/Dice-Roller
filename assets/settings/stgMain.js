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
    renderSettings();
  }
}

function renderSettings() {
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
        renderSettings();
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

  const startDiv = document.getElementById("startValueContainer");
  startDiv.innerHTML = "";

  const startLabel = document.createElement("label");
  startLabel.textContent = "Which Dice To Add : ";

  const startValueDisplay = document.createElement("span");
  startValueDisplay.textContent = faceOptions[startValue] || "";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = faceOptions.length - 1;
  slider.value = startValue;
  slider.addEventListener("input", (e) => {
    updateStartValue(parseInt(e.target.value));
    startValueDisplay.textContent = faceOptions[startValue] || "";
  });

  startDiv.appendChild(startLabel);
  startDiv.appendChild(slider);
  startDiv.appendChild(startValueDisplay);
}

function addFace() {
  const newFace = getNextFace();
  faceOptions.push(newFace);
  colors.push("#888888");
  saveSettings();
  renderSettings();
}

function resetSettings() {
  faceOptions = [4, 6, 8, 10, 12, 20];
  startValue = 1;
  colors = ["#3366CC", "#33CCCC", "#33CC33", "#E8D96F", "#FF9933", "#CC3333"];
  saveSettings();
  renderSettings();
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  renderSettings();

  document.getElementById("addFaceBtn").addEventListener("click", addFace);
  document.getElementById("resetBtn").addEventListener("click", resetSettings);
  document.getElementById("saveBtn").addEventListener("click", () => {
    window.location.href = "../main/dices.html";
  });
});
