const defaultSettings = {
  faceOptions: [4, 6, 8, 10, 12, 20],
  startValue: 1,
  colors: ["#3366CC", "#33CCCC", "#33CC33", "#E8D96F", "#FF9933", "#CC3333"],
  rollSpeed: 0,
  monster: false,
  deleteEnemyOnDeath: true,
  healHigherThanMax: false,
  splashDivide: false,
};

let settings = loadSettings();

Object.keys(defaultSettings).forEach((key) => {
  window[key] = settings[key];
});

function createJSON() {
  const obj = {};
  Object.keys(defaultSettings).forEach((key) => {
    obj[key] = typeof window[key] !== "undefined" ? window[key] : defaultSettings[key];
  });
  return obj;
}

function loadSettings() {
  const loaded = JSON.parse(localStorage.getItem("settings")) || defaultSettings;

  Object.keys(defaultSettings).forEach((key) => {
    window[key] = loaded[key];
  });

  saveSettings();
  return loaded;
}

function saveSettings() {
  const data = createJSON();
  localStorage.setItem("settings", JSON.stringify(data));
}

function resetSettings() {
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
  settings = { ...defaultSettings };
  Object.keys(defaultSettings).forEach((key) => {
    window[key] = defaultSettings[key];
  });
}
