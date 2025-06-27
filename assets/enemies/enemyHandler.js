let enemies = [];

function toggleEdit(id, enemyNum) {
  let enemyJSON = enemies[enemyNum];

  const enemy = document.getElementById(id);
  const healLabel = enemy.querySelector(".healLabel");
  const attackLabel = enemy.querySelector(".attackLabel");

  healLabel.style.display = "none";
  attackLabel.style.display = "none";

  const editIcon = enemy.querySelector(".edit-icon");
  editIcon.style.display = "none";

  const nameInput = enemy.querySelector(".edit-name");
  const hpInput = enemy.querySelector(".edit-hp");
  const image = enemy.querySelector(".enemy-image");

  nameInput.value = enemyJSON.name;
  hpInput.value = enemyJSON.currentHealth;
  image.src = enemyJSON.image;

  enemy.classList.toggle("editing");
}

function saveEnemy(id, enemyNum) {
  let enemyJSON = enemies[enemyNum];

  const enemy = document.getElementById(id);
  const nameInput = enemy.querySelector(".edit-name");
  const hpInput = enemy.querySelector(".edit-hp");
  const nameDisplay = enemy.querySelector(".enemy-name");
  const hpDisplay = enemy.querySelector(".enemy-hp-text");
  const hpBar = enemy.querySelector(".hp-bar");
  const image = enemy.querySelector(".enemy-image");

  nameDisplay.textContent = nameInput.value;
  hpDisplay.textContent = `HP: ${hpInput.value}`;

  if (parseInt(hpInput.value) >= 0) {
    hpBar.style.width = `${
      (parseInt(hpInput.value) / enemyJSON.maxHealth) * 100
    }%`;
  } else {
    hpBar.style.width = "0%";
  }

  enemyJSON.name = nameInput.value;
  enemyJSON.currentHealth = parseInt(hpInput.value);
  enemyJSON.image = image.src;

  const attackLabel = enemy.querySelector(".attackLabel");
  const healLabel = enemy.querySelector(".healLabel");

  attackLabel.style.display = "block";
  healLabel.style.display = "block";

  const editIcon = enemy.querySelector(".edit-icon");
  editIcon.style.display = "block";

  enemy.classList.remove("editing");

  enemies[enemyNum] = enemyJSON;
  saveEnemies();
}

function createEnemy(name, maxHealth) {
  const enemyJSON = {
    name: name,
    maxHealth: maxHealth,
    currentHealth: maxHealth,
    image: "../images/defaultEnemy.png",
  };

  const enemyNumber = enemies.length;

  const enemyContainer = document.getElementById("enemyContainer");

  const enemyDiv = document.createElement("div");
  enemyDiv.className = "enemy";
  enemyDiv.id = `enemy-${enemyNumber}`;

  const editIcon = document.createElement("div");
  editIcon.className = "edit-icon";
  editIcon.innerHTML = "&#9998;";
  editIcon.onclick = () => toggleEdit(enemyDiv.id, enemyNumber);

  const nameDiv = document.createElement("div");
  nameDiv.className = "enemy-name";
  nameDiv.textContent = name;

  const hpText = document.createElement("div");
  hpText.className = "enemy-hp-text";
  hpText.textContent = `HP: ${maxHealth}`;

  const hpBarContainer = document.createElement("div");
  hpBarContainer.className = "hp-bar-container";

  const hpBar = document.createElement("div");
  hpBar.className = "hp-bar";
  hpBar.style.width = "100%";

  const image = document.createElement("img");
  image.className = "enemy-image";
  image.src = enemyJSON.image;
  image.alt = "Enemy Image";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";

  image.addEventListener("click", () => {
    if (enemyDiv.classList.contains("editing")) {
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      image.src = e.target.result;
      enemies[enemyNumber].image = e.target.result;
      saveEnemies();
    };
    reader.readAsDataURL(file);
  });

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "actions";

  const attackDiv = document.createElement("div");
  const attackCheckbox = document.createElement("input");
  attackCheckbox.type = "checkbox";
  attackCheckbox.className = "attack";
  attackCheckbox.id = `attack-${enemyNumber}`;
  const attackLabel = document.createElement("label");
  attackLabel.htmlFor = attackCheckbox.id;
  attackLabel.className = "attackLabel";
  attackLabel.textContent = "Attack";

  const healDiv = document.createElement("div");
  const healCheckbox = document.createElement("input");
  healCheckbox.type = "checkbox";
  healCheckbox.className = "heal";
  healCheckbox.id = `heal-${enemyNumber}`;
  const healLabel = document.createElement("label");
  healLabel.htmlFor = healCheckbox.id;
  healLabel.className = "healLabel";
  healLabel.textContent = "Heal";

  const nameEditInput = document.createElement("input");
  nameEditInput.type = "text";
  nameEditInput.className = "edit-name";
  nameEditInput.placeholder = "Name";

  const hpEditInput = document.createElement("input");
  hpEditInput.type = "number";
  hpEditInput.className = "edit-hp";
  hpEditInput.min = 0;
  hpEditInput.placeholder = "Health";

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.className = "save-button";
  saveButton.onclick = () => saveEnemy(enemyDiv.id, enemyNumber);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-button";
  deleteButton.onclick = () => deleteEnemy(enemyNumber);

  enemyContainer.appendChild(enemyDiv);

  enemyDiv.appendChild(editIcon);
  enemyDiv.appendChild(nameDiv);
  enemyDiv.appendChild(nameEditInput);
  enemyDiv.appendChild(hpText);
  enemyDiv.appendChild(hpEditInput);
  enemyDiv.appendChild(hpBarContainer);
  hpBarContainer.appendChild(hpBar);
  enemyDiv.appendChild(image);
  enemyDiv.appendChild(fileInput);

  enemyDiv.appendChild(actionsDiv);
  actionsDiv.appendChild(attackDiv);
  actionsDiv.appendChild(healDiv);

  attackDiv.appendChild(attackCheckbox);
  attackDiv.appendChild(attackLabel);

  healDiv.appendChild(healCheckbox);
  healDiv.appendChild(healLabel);

  enemyDiv.appendChild(saveButton);
  enemyDiv.appendChild(deleteButton);

  enemies.push(enemyJSON);

  healCheckbox.addEventListener("change", () => {
    if (healCheckbox.checked) {
      attackCheckbox.checked = false;
    }
  });
  attackCheckbox.addEventListener("change", () => {
    if (attackCheckbox.checked) {
      healCheckbox.checked = false;
    }
  });

  return enemyDiv;
}

function deleteEnemy(enemyNumber) {
  const enemyDiv = document.getElementById(`enemy-${enemyNumber}`);
  if (enemyDiv) enemyDiv.remove();

  enemies.splice(enemyNumber, 1);
  saveEnemies();

  const enemyContainer = document.getElementById("enemyContainer");
  const enemyDivs = enemyContainer.querySelectorAll(".enemy");
  enemyDivs.forEach((div, idx) => {
    div.id = `enemy-${idx}`;

    const editIcon = div.querySelector(".edit-icon");
    if (editIcon) editIcon.onclick = () => toggleEdit(div.id, idx);

    const saveBtn = div.querySelector(".save-button");
    if (saveBtn) saveBtn.onclick = () => saveEnemy(div.id, idx);

    const deleteBtn = div.querySelector(".delete-button");
    if (deleteBtn) deleteBtn.onclick = () => deleteEnemy(idx);

    const attackCheckbox = div.querySelector(".attack");
    if (attackCheckbox) {
      attackCheckbox.id = `attack-${idx}`;
      const attackLabel = div.querySelector(".attackLabel");
      if (attackLabel) attackLabel.htmlFor = attackCheckbox.id;
    }

    const healCheckbox = div.querySelector(".heal");
    if (healCheckbox) {
      healCheckbox.id = `heal-${idx}`;
      const healLabel = div.querySelector(".healLabel");
      if (healLabel) healLabel.htmlFor = healCheckbox.id;
    }
  });
}

function loadEnemies() {
  const storedEnemies = localStorage.getItem("enemies");
  if (storedEnemies) {
    const loadedEnemies = JSON.parse(storedEnemies);
    loadedEnemies.forEach((enemy) => {
      const enemyDiv = createEnemy(enemy.name, enemy.maxHealth);
      const index = enemies.length - 1;

      enemies[index].currentHealth = enemy.currentHealth;
      enemies[index].image = enemy.image;

      const hpBar = enemyDiv.querySelector(".hp-bar");
      const hpText = enemyDiv.querySelector(".enemy-hp-text");
      const image = enemyDiv.querySelector(".enemy-image");

      image.src = enemy.image;
      hpText.textContent = `HP: ${enemy.currentHealth}`;

      hpBar.style.width = "0%";
      setTimeout(() => {
        hpBar.style.width = `${(enemy.currentHealth / enemy.maxHealth) * 100}%`;
      }, 20);
    });
  }
}

function saveEnemies() {
  localStorage.setItem("enemies", JSON.stringify(enemies));
}

function updateEnemyHP(enemyNumber, newHP) {
  const enemy = enemies[enemyNumber];
  const enemyDiv = document.getElementById(`enemy-${enemyNumber}`);
  if (!enemy || !enemyDiv) return;

  const hpBar = enemyDiv.querySelector(".hp-bar");
  const hpText = enemyDiv.querySelector(".enemy-hp-text");

  enemy.currentHealth = newHP < 0 ? 0 : newHP;
  hpText.textContent = `HP: ${enemy.currentHealth}`;

  hpBar.style.width = `${(enemy.currentHealth / enemy.maxHealth) * 100}%`;
}

function attackEnemy(enemyNumber, damage, type) {
  damage = parseInt(damage);
  if (isNaN(damage)) return;

  const enemy = enemies[enemyNumber];
  if (!enemy) return;

  if (type === "heal") {
    enemy.currentHealth += damage;
    if (enemy.currentHealth > enemy.maxHealth && !healHigherThanMax)
      enemy.currentHealth = enemy.maxHealth;
  } else {
    enemy.currentHealth -= damage;
  }

  updateEnemyHP(enemyNumber, enemy.currentHealth);
}

function attackEnemies() {
  const enemyDivs = document.querySelectorAll(".enemy");

  let targetEnemies = [];

  enemyDivs.forEach((enemyDiv) => {
    const attackCheckbox = enemyDiv.querySelector(".attack");
    const healCheckbox = enemyDiv.querySelector(".heal");
    const enemyNumber = parseInt(enemyDiv.id.split("-")[1]);

    if (attackCheckbox?.checked || healCheckbox?.checked) {
      targetEnemies.push(enemyNumber);
    }
  });

  const totalDamage = parseInt(document.getElementById("totalNum").textContent);
  let attackDamage = totalDamage;
  let healDamage = totalDamage;

  if (typeof splashDivide !== "undefined" && splashDivide) {
    attackDamage = Math.floor(totalDamage / 2);
    healDamage = Math.floor(totalDamage / 2);
  }

  targetEnemies.forEach((enemyNum) => {
    const enemyDiv = document.getElementById(`enemy-${enemyNum}`);
    if (!enemyDiv) return;

    const attackCheckbox = enemyDiv.querySelector(".attack");
    const healCheckbox = enemyDiv.querySelector(".heal");

    if (attackCheckbox?.checked) attackEnemy(enemyNum, attackDamage, "attack");
    if (healCheckbox?.checked) attackEnemy(enemyNum, healDamage, "heal");

    attackCheckbox.checked = false;
    healCheckbox.checked = false;
  });

  const toDelete = [];
  targetEnemies.forEach((enemyIndex) => {
    const enemy = enemies[enemyIndex];
    if (
      enemy &&
      enemy.currentHealth <= 0 &&
      typeof deleteEnemyOnDeath !== "undefined" &&
      deleteEnemyOnDeath
    ) {
      toDelete.push(enemyIndex);
    }
  });

  toDelete
    .sort((a, b) => b - a)
    .forEach((idx) => {
      deleteEnemy(idx);
    });

  saveEnemies();
}

function recreateEnemies() {
  const enemyContainer = document.getElementById("enemyContainer");
  const enemyDivs = enemyContainer.querySelectorAll(".enemy");
  enemyDivs.forEach((div) => div.remove());

  const oldEnemies = [...enemies];
  enemies = [];

  oldEnemies.forEach((enemy) => {
    createEnemy(enemy.name, enemy.maxHealth);
  });

  enemies.forEach((enemy, idx) => {
    enemy.currentHealth = oldEnemies[idx].currentHealth;
    enemy.image = oldEnemies[idx].image;

    const enemyDiv = document.getElementById(`enemy-${idx}`);
    const hpBar = enemyDiv.querySelector(".hp-bar");
    const hpText = enemyDiv.querySelector(".enemy-hp-text");
    const image = enemyDiv.querySelector(".enemy-image");

    image.src = enemy.image;
    hpText.textContent = `HP: ${enemy.currentHealth}`;

    hpBar.style.width = "0%";
    setTimeout(() => {
      hpBar.style.width = `${(enemy.currentHealth / enemy.maxHealth) * 100}%`;
    }, 20);
  });

  saveEnemies();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addEnemyBtn").addEventListener("click", () => {
    const name = document.getElementById("newEnemyName").value;
    const maxHealth = parseInt(document.getElementById("newEnemyHP").value);
    createEnemy(name, maxHealth);
    saveEnemies();
  });

  document.getElementById("clear").addEventListener("click", () => {
    enemies = [];
    saveEnemies();
    recreateEnemies();
  });

  document.getElementById("attack").addEventListener("click", attackEnemies);

  loadEnemies();
});
