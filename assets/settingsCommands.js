var faceOptions = [4, 6, 8, 10, 12, 20];
var startValue = 1;
var colors = [
  "#3366CC",
  "#33CCCC",
  "#33CC33",
  "#E8D96F",
  "#FF9933",
  "#CC3333",
];

function loadSettings() {
  const stored = localStorage.getItem("settings");
  if (stored) {
    const settings = JSON.parse(stored);
    faceOptions = settings.faceOptions || faceOptions;
    startValue = settings.startValue !== undefined ? settings.startValue : startValue;
    colors = settings.colors || colors;
  } else {
    saveSettings();
  }
}

function saveSettings() {
    var settings = {
        faceOptions: faceOptions,
        startValue: startValue,
        colors: colors
    };
    localStorage.setItem("settings", JSON.stringify(settings));
}