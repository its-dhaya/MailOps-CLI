const fs = require("fs");
const authenticate = require("./oauth2");
const { google } = require("googleapis");
const { applyLabel } = require("./label");

async function getCheckpoint() {
  if (!fs.existsSync("checkpoint.json")) {
    const now = Date.now();
    updateCheckpoint(now);

    return now; // start from NOW, not ancient emails
  }

  const data = JSON.parse(fs.readFileSync("checkpoint.json"));
  return data.lastChecked || Date.now();
}

function updateCheckpoint(timestamp) {
  fs.writeFileSync(
    "checkpoint.json",
    JSON.stringify({ lastChecked: timestamp }, null, 2)
  );
}

async function runRules() {
  try {
    const rules = JSON.parse(fs.readFileSync("rules.json"));

    const auth = await authenticate();
    const gmail = google.gmail({ version: "v1", auth });

    console.log("⚡ Running rule engine...\n");

    // Fetch recent emails (start small)
    const res = await gmail.users.messages.list({
      userId: "me",
      q: `after:${Math.floor(lastChecked / 1000)}`,
    });

    const messages = res.data.messages || [];

    if (!messages.length) {
      console.log("📭 No emails found.");
      return;
    }

    for (const msg of messages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const payload = email.data.payload;
      const headers = payload.headers;

      const subject =
        headers.find((h) => h.name === "Subject")?.value.toLowerCase() || "";

      const snippet = email.data.snippet?.toLowerCase() || "";

      const combinedText = subject + " " + snippet;

      // 🔥 Rule Matching
      for (const rule of rules) {
        if (rule.type === "keyword") {
          if (combinedText.includes(rule.value.toLowerCase())) {
            console.log(
              `✅ Match found for "${rule.value}" → Applying ${rule.label}`
            );

            await applyLabel(msg.id, rule.label);
          }
        }
      }
    }

    console.log("\n✅ Rule engine completed.");
    updateCheckpoint(Date.now());
  } catch (err) {
    console.error("❌ Rule Engine Error:", err.message);
  }
}

module.exports = { runRules };
