const fs = require("fs");
const path = require("path");
const readline = require("readline");
const authenticate = require("./oauth2");

const TOKENS_DIR = path.join(__dirname, "tokens");
const ACTIVE_ACCOUNT_PATH = path.join(__dirname, "activeAccount.json");

// ✅ Ensure tokens folder exists
if (!fs.existsSync(TOKENS_DIR)) {
  fs.mkdirSync(TOKENS_DIR);
}

// ===============================
// 👉 ADD ACCOUNT
// ===============================
async function addAccount() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "Enter account nickname (example: personal, work): ",
    async (name) => {
      const tokenPath = path.join(TOKENS_DIR, `${name}.json`);

      if (fs.existsSync(tokenPath)) {
        console.log("⚠️ Account already exists!");
        rl.close();
        return;
      }

      // Temporarily set active account so oauth saves token correctly
      fs.writeFileSync(
        ACTIVE_ACCOUNT_PATH,
        JSON.stringify({ account: name }, null, 2)
      );

      console.log("\n🚀 Starting OAuth flow...");

      await authenticate();

      console.log(`✅ Account '${name}' added successfully!`);

      rl.close();
    }
  );
}

// ===============================
// 👉 LIST ACCOUNTS
// ===============================
function listAccounts() {
  const files = fs.readdirSync(TOKENS_DIR);

  if (!files.length) {
    console.log("📭 No accounts added yet.");
    return;
  }

  console.log("\n📧 Available Accounts:\n");

  files.forEach((file) => {
    console.log("✔", file.replace(".json", ""));
  });
}

// ===============================
// 👉 SWITCH ACCOUNT
// ===============================
function switchAccount(name) {
  const tokenPath = path.join(TOKENS_DIR, `${name}.json`);

  if (!fs.existsSync(tokenPath)) {
    console.log("❌ Account not found.");
    return;
  }

  fs.writeFileSync(
    ACTIVE_ACCOUNT_PATH,
    JSON.stringify({ account: name }, null, 2)
  );

  console.log(`✅ Switched to account: ${name}`);
}

module.exports = {
  addAccount,
  listAccounts,
  switchAccount,
};
