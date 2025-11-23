// --- 1. Define your OG and WL wallets directly here for now ---

const ogAddresses = [
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222"
];

const wlAddresses = [
  "0x3333333333333333333333333333333333333333",
  "0x2222222222222222222222222222222222222222"
];

// normalize to lowercase and put in Sets
const ogSet = new Set(ogAddresses.map((a) => a.toLowerCase()));
const wlSet = new Set(wlAddresses.map((a) => a.toLowerCase()));

// --- helper: simple ethereum address format check ---
function isValidAddress(addr) {
  // must start with 0x and be 42 chars total (2 + 40 hex)
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

// --- 2. Helper to show result box ---
function showResult(stateClass, title, message, extra, icon) {
  const el = document.getElementById("result");

  // reset to base class + add state class
  el.className = "result " + stateClass;

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

// --- 3. Main check function ---
function checkWalletStatus() {
  const input = document.getElementById("wallet-input");
  const addressRaw = input.value.trim();

  if (!addressRaw) {
    showResult(
      "state-none",
      "No Address",
      "Please paste a wallet address to check your status.",
      "",
      "⚠️"
    );
    return;
  }

  if (!isValidAddress(addressRaw)) {
    showResult(
      "state-invalid",
      "Invalid Address",
      "Please enter a valid Ethereum wallet address.",
      "Address should start with <strong>0x</strong> and be <strong>42 characters</strong> long.",
      "⚠️"
    );
    return;
  }

  const address = addressRaw.toLowerCase();
  const isOG = ogSet.has(address);
  const isWL = wlSet.has(address);

  if (isOG && isWL) {
    showResult(
      "state-both",
      "OG + WL Whitelisted",
      "Your wallet is whitelisted for <strong>OG Phase</strong> and <strong>WL Phase</strong>.",
      "Double the perks. Be ready, Snoopy! 🐾",
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

// --- 4. Wire events when page is ready ---
window.addEventListener("DOMContentLoaded", () => {
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
