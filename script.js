/* =========================
   ELECTROCALC PRO SCRIPT
   Powered by OMOLADE
========================= */

const display = document.getElementById("display");

// Load history when page opens
window.onload = function () {
  loadHistory();
};

/* =========================
   TAB SWITCHING
========================= */
function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-btn");

  tabs.forEach(tab => tab.classList.remove("active"));
  buttons.forEach(btn => btn.classList.remove("active"));

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.add("active");
  }

  buttons.forEach(btn => {
    const btnText = btn.textContent.trim().toLowerCase();
    if (btnText === tabId.toLowerCase()) {
      btn.classList.add("active");
    }
  });
}

/* =========================
   BASIC CALCULATOR
========================= */
function appendValue(value) {
  if (display.value === "Error") {
    display.value = "";
  }
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculateResult() {
  try {
    const expression = display.value;
    if (!expression) return;

    const result = eval(expression);
    addToHistory(`Basic: ${expression} = ${result}`);
    display.value = result;
  } catch (error) {
    display.value = "Error";
  }
}

/* =========================
   SCIENTIFIC CALCULATOR
========================= */
function getSciDisplay() {
  return document.getElementById("sciDisplay");
}

function appendSciValue(value) {
  const sciDisplay = getSciDisplay();
  if (
    sciDisplay.value === "Error" ||
    sciDisplay.value === "Enter value" ||
    sciDisplay.value === "Invalid" ||
    sciDisplay.value === "Enter base"
  ) {
    sciDisplay.value = "";
  }
  sciDisplay.value += value;
}

function clearSciDisplay() {
  const sciDisplay = getSciDisplay();
  sciDisplay.value = "";
}

function backspaceSci() {
  const sciDisplay = getSciDisplay();
  sciDisplay.value = sciDisplay.value.slice(0, -1);
}

function calculateSciResult() {
  const sciDisplay = getSciDisplay();
  try {
    const expression = sciDisplay.value;
    if (!expression) return;

    const result = eval(expression);
    addToHistory(`Scientific: ${expression} = ${result}`);
    sciDisplay.value = result;
  } catch (error) {
    sciDisplay.value = "Error";
  }
}

function scientificCalc(type) {
  const sciDisplay = getSciDisplay();
  let value = parseFloat(sciDisplay.value);

  if (isNaN(value) && type !== "power") {
    sciDisplay.value = "Enter value";
    return;
  }

  let result;

  switch (type) {
    case "sqrt":
      if (value < 0) {
        sciDisplay.value = "Invalid";
        return;
      }
      result = Math.sqrt(value);
      addToHistory(`Scientific: √${value} = ${result}`);
      break;

    case "square":
      result = Math.pow(value, 2);
      addToHistory(`Scientific: ${value}² = ${result}`);
      break;

    case "power":
      let exponent = prompt("Enter power value:");
      if (exponent === null || exponent === "") return;

      let base = parseFloat(sciDisplay.value);
      let powerValue = parseFloat(exponent);

      if (isNaN(base)) {
        sciDisplay.value = "Enter base";
        return;
      }

      if (isNaN(powerValue)) {
        sciDisplay.value = "Invalid";
        return;
      }

      result = Math.pow(base, powerValue);
      addToHistory(`Scientific: ${base}^${powerValue} = ${result}`);
      break;

    case "percent":
      result = value / 100;
      addToHistory(`Scientific: ${value}% = ${result}`);
      break;

    case "sin":
      result = Math.sin(value * Math.PI / 180);
      addToHistory(`Scientific: sin(${value}°) = ${result}`);
      break;

    case "cos":
      result = Math.cos(value * Math.PI / 180);
      addToHistory(`Scientific: cos(${value}°) = ${result}`);
      break;

    case "tan":
      result = Math.tan(value * Math.PI / 180);
      addToHistory(`Scientific: tan(${value}°) = ${result}`);
      break;

    case "log":
      if (value <= 0) {
        sciDisplay.value = "Invalid";
        return;
      }
      result = Math.log10(value);
      addToHistory(`Scientific: log(${value}) = ${result}`);
      break;

    case "ln":
      if (value <= 0) {
        sciDisplay.value = "Invalid";
        return;
      }
      result = Math.log(value);
      addToHistory(`Scientific: ln(${value}) = ${result}`);
      break;

    case "factorial":
      if (value < 0 || !Number.isInteger(value)) {
        sciDisplay.value = "Invalid";
        return;
      }
      result = 1;
      for (let i = 1; i <= value; i++) {
        result *= i;
      }
      addToHistory(`Scientific: ${value}! = ${result}`);
      break;

    default:
      return;
  }

  sciDisplay.value = result;
}

/* =========================
   HISTORY
========================= */
function addToHistory(entry) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

  history.unshift(entry);

  if (history.length > 100) {
    history = history.slice(0, 100);
  }

  localStorage.setItem("calcHistory", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

  if (history.length === 0) {
    historyList.innerHTML = "<p class='history-item'>No calculations yet.</p>";
    return;
  }

  historyList.innerHTML = history
    .map(item => `<div class="history-item">${item}</div>`)
    .join("");
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  loadHistory();
}

/* =========================
   ELECTRICAL CALCULATIONS
========================= */

// OHM'S LAW
function solveOhmsLaw() {
  const V = parseFloat(document.getElementById("voltage").value);
  const I = parseFloat(document.getElementById("current").value);
  const R = parseFloat(document.getElementById("resistance").value);

  let resultText = "";
  let filledCount = 0;

  if (!isNaN(V)) filledCount++;
  if (!isNaN(I)) filledCount++;
  if (!isNaN(R)) filledCount++;

  if (filledCount !== 2) {
    resultText = "Enter exactly 2 values to solve the 3rd.";
    document.getElementById("ohmsResult").textContent = resultText;
    return;
  }

  if (!isNaN(V) && !isNaN(I) && isNaN(R)) {
    if (I === 0) {
      resultText = "Current cannot be 0.";
    } else {
      const result = V / I;
      resultText = `Resistance (R) = ${result.toFixed(4)} Ω`;
      addToHistory(`Electrical: R = ${V}/${I} = ${result.toFixed(4)} Ω`);
    }
  } else if (!isNaN(V) && isNaN(I) && !isNaN(R)) {
    if (R === 0) {
      resultText = "Resistance cannot be 0.";
    } else {
      const result = V / R;
      resultText = `Current (I) = ${result.toFixed(4)} A`;
      addToHistory(`Electrical: I = ${V}/${R} = ${result.toFixed(4)} A`);
    }
  } else if (isNaN(V) && !isNaN(I) && !isNaN(R)) {
    const result = I * R;
    resultText = `Voltage (V) = ${result.toFixed(4)} V`;
    addToHistory(`Electrical: V = ${I}×${R} = ${result.toFixed(4)} V`);
  }

  document.getElementById("ohmsResult").textContent = resultText;
}

// POWER
function calculatePower() {
  const V = parseFloat(document.getElementById("powerVoltage").value);
  const I = parseFloat(document.getElementById("powerCurrent").value);

  if (isNaN(V) || isNaN(I)) {
    document.getElementById("powerResult").textContent = "Enter voltage and current.";
    return;
  }

  const power = V * I;
  document.getElementById("powerResult").textContent = `Power (P) = ${power.toFixed(4)} W`;
  addToHistory(`Electrical: P = ${V}×${I} = ${power.toFixed(4)} W`);
}

// SERIES RESISTANCE
function calculateSeriesResistance() {
  const input = document.getElementById("seriesResistors").value;

  if (!input.trim()) {
    document.getElementById("seriesResult").textContent = "Enter resistor values.";
    return;
  }

  const resistors = input
    .split(",")
    .map(r => parseFloat(r.trim()))
    .filter(r => !isNaN(r));

  if (resistors.length === 0) {
    document.getElementById("seriesResult").textContent = "Invalid input.";
    return;
  }

  const total = resistors.reduce((sum, r) => sum + r, 0);

  document.getElementById("seriesResult").textContent = `Total Series Resistance = ${total.toFixed(4)} Ω`;
  addToHistory(`Electrical: Series (${input}) = ${total.toFixed(4)} Ω`);
}

// PARALLEL RESISTANCE
function calculateParallelResistance() {
  const input = document.getElementById("parallelResistors").value;

  if (!input.trim()) {
    document.getElementById("parallelResult").textContent = "Enter resistor values.";
    return;
  }

  const resistors = input
    .split(",")
    .map(r => parseFloat(r.trim()))
    .filter(r => !isNaN(r));

  if (resistors.length === 0) {
    document.getElementById("parallelResult").textContent = "Invalid input.";
    return;
  }

  if (resistors.includes(0)) {
    document.getElementById("parallelResult").textContent = "Resistance cannot be 0.";
    return;
  }

  const reciprocalSum = resistors.reduce((sum, r) => sum + (1 / r), 0);

  if (reciprocalSum === 0) {
    document.getElementById("parallelResult").textContent = "Invalid calculation.";
    return;
  }

  const total = 1 / reciprocalSum;

  document.getElementById("parallelResult").textContent = `Total Parallel Resistance = ${total.toFixed(4)} Ω`;
  addToHistory(`Electrical: Parallel (${input}) = ${total.toFixed(4)} Ω`);
}

// AC REACTANCE
function calculateReactance() {
  const f = parseFloat(document.getElementById("frequency").value);
  const C = parseFloat(document.getElementById("capacitance").value);
  const L = parseFloat(document.getElementById("inductance").value);

  let resultText = "";

  if (isNaN(f) || f <= 0) {
    document.getElementById("reactanceResult").textContent = "Enter a valid frequency greater than 0.";
    return;
  }

  if (!isNaN(C)) {
    if (C <= 0) {
      resultText += "Capacitance must be greater than 0. ";
    } else {
      const Xc = 1 / (2 * Math.PI * f * C);
      resultText += `Capacitive Reactance (Xc) = ${Xc.toFixed(4)} Ω`;
      addToHistory(`Electrical: Xc = 1/(2π×${f}×${C}) = ${Xc.toFixed(4)} Ω`);
    }
  }

  if (!isNaN(L)) {
    const Xl = 2 * Math.PI * f * L;
    if (resultText !== "") {
      resultText += " | ";
    }
    resultText += `Inductive Reactance (Xl) = ${Xl.toFixed(4)} Ω`;
    addToHistory(`Electrical: Xl = 2π×${f}×${L} = ${Xl.toFixed(4)} Ω`);
  }

  if (resultText === "") {
    resultText = "Enter frequency with capacitance and/or inductance.";
  }

  document.getElementById("reactanceResult").textContent = resultText;
}

/* =========================
   PWA INSTALL POPUP
========================= */
let deferredPrompt;
const installBar = document.getElementById("installBar");
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBar) {
    installBar.classList.add("show");
  }
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }

    deferredPrompt = null;

    if (installBar) {
      installBar.classList.remove("show");
    }
  });
}

window.addEventListener("appinstalled", () => {
  console.log("PWA installed");
  if (installBar) {
    installBar.classList.remove("show");
  }
});
