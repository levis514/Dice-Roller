let diceList = [];
let result = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function animation(dice, max) {
  const totalRandomNumbers = 20;
  let animationDuration = 3000;
  const easingFunction = (t) => t * (2 - t);
  const finalBgColor = "transparent";
  let initialDelay = 50;

  if (rollSpeed == "1") {
    animationDuration = animationDuration / 2.5;
    initialDelay = initialDelay / 2.5;
  } else if (rollSpeed == "2") {
    animationDuration = 0;
    initialDelay = 0;
  }

  const inner = document.createElement("div");
  inner.className = "rolling-numbers";

  for (let i = 0; i < totalRandomNumbers; i++) {
    const num = document.createElement("div");
    num.textContent = Math.floor(Math.random() * max) + 1;
    inner.appendChild(num);
  }

  const final = Math.floor(Math.random() * max) + 1;
  const finalDiv = document.createElement("div");
  finalDiv.textContent = final;
  finalDiv.style.background = finalBgColor;
  inner.appendChild(finalDiv);

  dice.innerHTML = "";
  dice.style.overflow = "hidden";
  dice.appendChild(inner);

  await sleep(initialDelay);

  const rowHeight = inner.firstChild.getBoundingClientRect().height;
  const totalNumbers = inner.childNodes.length;
  const scrollTo = rowHeight * (totalNumbers - 1);

  const startTime = performance.now();

  await new Promise((resolve) => {
    function animate(time) {
      const elapsed = time - startTime;
      let progress = elapsed / animationDuration;
      if (progress > 1) progress = 1;

      const easedProgress = easingFunction(progress);
      const currentY = easedProgress * scrollTo;

      inner.style.transform = `translateY(-${currentY}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(animate);
  });

  return final;
}

async function spawnDice() {
  const resultDiv = document.getElementById("diceContainer");
  resultDiv.innerHTML = "";
  result = [];

  const animations = [];
  let idx = 0;
  let cooldown = 500;

  if (rollSpeed == "1") {
    cooldown = cooldown / 2.5;
  }

  for (const diceValue of diceList) {
    idx++;

    if (idx !== 1 && rollSpeed != "2") {
      await sleep(cooldown);
    }

    const dice = document.createElement("div");
    dice.className = "result-dice";
    dice.textContent = faceOptions[diceValue];

    resultDiv.appendChild(dice);

    const animPromise = animation(dice, faceOptions[diceValue]).then(
      (finalResult) => {
        result.push(finalResult);
      }
    );

    animations.push(animPromise);
  }

  await Promise.all(animations);

  createRerollButton();

  const total = result.reduce((acc, val) => acc + val, 0);
  createTotalLabel(total);
}

function loadStorage() {
  if (localStorage.getItem("dices") != null) {
    if (JSON.parse(localStorage.getItem("dices")).length > 0) {
      diceList = JSON.parse(localStorage.getItem("dices"));
    } else {
      window.location.href = "../main/dices.html";
    }
  }
}

function createRerollButton() {
  const buttons = document.getElementById("buttons");

  const rerollBtn = document.createElement("button");
  rerollBtn.textContent = "Roll Again";
  rerollBtn.id = "rollAgainBtn";

  buttons.appendChild(rerollBtn);

  rerollBtn.addEventListener("click", () => {
    if (monster) {
      window.location.href = "enemies.html";
    } else {
      window.location.href = "roll.html";
    }
  });
}

function createTotalLabel(total) {
  const totalNum = document.getElementById("totalNum");
  totalNum.textContent = total;

  if (monster) {
    document.getElementById("attack").style.display = "block";
  }
}

function createSettingsButton() {
  const buttons = document.getElementById("buttons");

  const changeSettingBtn = document.createElement("button");
  changeSettingBtn.textContent = "Change Settings";
  changeSettingBtn.id = "changeSettingsBtn";

  buttons.appendChild(changeSettingBtn);

  changeSettingBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
}


createSettingsButton();
loadSettings();
loadStorage();
spawnDice();
