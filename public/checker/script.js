// ---- GLOBAL STATE ----
let ogSet = new Set();
let wlSet = new Set();
let walletsLoaded = false;

// Simple Ethereum address validator
function isValidAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

// Load wallets from wallets.json
async function loadWallets() {
  try {
    // cache bust to avoid old versions being cached
    const res = await fetch("./wallets.json?cb=" + Date.now());
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();

    const ogList = (data.og || []).map((a) => a.toLowerCase());
    const wlList = (data.wl || []).map((a) => a.toLowerCase());

    ogSet = new Set(ogList);
    wlSet = new Set(wlList);
    walletsLoaded = true;

    console.log("Wallets loaded:", ogSet.size, "OG,", wlSet.size, "WL");
  } catch (err) {
    console.error("Failed to load wallets.json:", err);
  }
}

// ---- RESULT BOX RENDERING ----
function showResult(stateClass, title, message, extra, icon) {
  const el = document.getElementById("result");

  el.className = "result " + stateClass; // base + state class

  el.innerHTML = `
    <div class="result-inner">
      <div class="result-icon">${icon}</div>
      <div class="result-title">${title}</div>
      <div class="result-message">${message}</div>
      ${extra ? `<div class="result-extra">${extra}</div>` : ""}
    </div>
  `;

  el.classList.remove("hidden");
}

// ---- MAIN CHECK FUNCTION ----
function checkWalletStatus() {
  const input = document.getElementById("wallet-input");
  const raw = input.value.trim();

  if (!raw) {
    showResult(
      "state-none",
      "No Address",
      "Please paste a wallet address to check your status.",
      "",
      "⚠️"
    );
    return;
  }

  if (!isValidAddress(raw)) {
    showResult(
      "state-invalid",
      "Invalid Address",
      "Please enter a valid Ethereum wallet address.",
      "It should start with <strong>0x</strong> and be <strong>42 characters</strong> long.",
      "⚠️"
    );
    return;
  }

  if (!walletsLoaded) {
    showResult(
      "state-none",
      "Still Loading",
      "The whitelist is still loading. Please try again in a moment.",
      "",
      "⏳"
    );
    return;
  }

  const address = raw.toLowerCase();
  const isOG = ogSet.has(address);
  const isWL = wlSet.has(address);

  if (isOG && isWL) {
    showResult(
      "state-both",
      "OG + WL Whitelisted",
      "Your wallet is whitelisted for <strong>OG Phase</strong> and <strong>WL Phase</strong>.",
      "Double the perks, Snoopy! 🐾",
      "✅"
    );
  } else if (isOG) {
    showResult(
      "state-og",
      "Whitelisted",
      'Your wallet is whitelisted for: <strong>OG Phase</strong>.',
      "Be ready, Snoopy!",
      "✅"
    );
  } else if (isWL) {
    showResult(
      "state-wl",
      "Whitelisted",
      'Your wallet is whitelisted for: <strong>WL Phase</strong>.',
      "See you at mint time, Snoopy!",
      "✅"
    );
  } else {
    showResult(
      "state-none",
      "Not Whitelisted",
      "This wallet is not on the whitelist.",
      "Check back later for public mint opportunities.",
      "✖"
    );
  }
}

// ---- WIRE UP EVENTS & LOAD DATA ----
window.addEventListener("DOMContentLoaded", () => {
  // load OG/WL from wallets.json
  loadWallets();

  // button click
  document
    .getElementById("check-btn")
    .addEventListener("click", checkWalletStatus);

  // Enter key
  document
    .getElementById("wallet-input")
    .addEventListener("keyup", (e) => {
      if (e.key === "Enter") checkWalletStatus();
    });

  // footer year
  document.getElementById("year").textContent = new Date().getFullYear();
});
