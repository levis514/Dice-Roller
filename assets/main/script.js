let diceCount = 1;
let diceList = [];

function addDiceInstance(faces) {
  const diceId = diceCount - 1;
  let value = faces;

  const diceContainer = document.getElementById("diceContainer");

  const dice = document.createElement("div");
  dice.className = "dice";
  dice.style.backgroundColor = "hsl(200, 60%, 80%)";

  const label = document.createElement("label");
  label.textContent = `Dice ${diceCount++}`;
  dice.appendChild(label);

  const faceControls = document.createElement("div");
  faceControls.className = "face-controls";

  const minusBtn = document.createElement("button");
  minusBtn.className = "face-minus";
  minusBtn.textContent = "-";

  const plusBtn = document.createElement("button");
  plusBtn.className = "face-plus";
  plusBtn.textContent = "+";

  const faceText = document.createElement("span");
  faceText.style.color = colors[value];
  faceText.className = "face-value";
  faceText.textContent = faceOptions[value];

  const dltBtn = document.createElement("button");
  dltBtn.className = "removeBtn";
  dltBtn.textContent = "x";

  faceControls.appendChild(minusBtn);
  faceControls.appendChild(faceText);
  faceControls.appendChild(plusBtn);

  dice.appendChild(faceControls);
  dice.appendChild(dltBtn);

  diceContainer.appendChild(dice);

  plusBtn.addEventListener("click", () => {
    if (value < faceOptions.length - 1) {
      value += 1;
      faceText.textContent = faceOptions[value];
      faceText.style.color = colors[value];
      diceList[diceId] = value;
      updatels();
    }
  });

  minusBtn.addEventListener("click", () => {
    if (value > 0) {
      value -= 1;
      faceText.textContent = faceOptions[value];
      faceText.style.color = colors[value];
      diceList[diceId] = value;
      updatels();
    }
  });

  dltBtn.addEventListener("click", () => {
    diceList.splice(diceId, 1);
    updatels();
    load();
  });
}

function addDice(faces) {
  diceList.push(faces);

  updatels();

  addDiceInstance(faces);
}

function loadStorage() {
  if (localStorage.getItem("dices") != null) {
    if (JSON.parse(localStorage.getItem("dices")).length > 0) {
      diceList = JSON.parse(localStorage.getItem("dices"));

      let result = [];

      for (const dice of diceList) {
        if (dice > faceOptions.length - 1) {
          result.push(faceOptions.length - 1);
        } else {
          result.push(dice);
        }
      }

      diceList = result;
    } else {
      diceList = [startValue];
    }
  }
}

function load() {
  clearDice();

  for (const dice of diceList) {
    addDiceInstance(dice);
  }
}

function clearDice() {
  document.getElementById("diceContainer").innerHTML = "";

  diceCount = 1;
}

function updatels() {
  localStorage.setItem("dices", JSON.stringify(diceList));
}

function reset() {
  localStorage.setItem("dices", JSON.stringify([]));

  diceList = [];

  clearDice();
}

const addDiceBtn = document.getElementById("addDiceBtn");
const resetBtn = document.getElementById("resetBtn");
const rollBtn = document.getElementById("rollBtn");
const advBtn = document.getElementById("advancedSettingsBtn");

addDiceBtn.addEventListener("click", () => addDice(startValue));
resetBtn.addEventListener("click", () => reset());
rollBtn.addEventListener("click", () => {
  updatels();

  window.location.href = "../roll/roll.html";
});
advBtn.addEventListener("click", () => {
  updatels();

  window.location.href = "../settings/settings.html";
});

loadSettings();
loadStorage();
load();
