const fs = require("fs");
const path = require("path");

const SNIPPET_PATH = path.join(__dirname, "snippets.json");

//////////////////////////////////////////////////////
// Load Snippets
//////////////////////////////////////////////////////

function loadSnippets() {
  if (!fs.existsSync(SNIPPET_PATH)) return {};

  try {
    return JSON.parse(fs.readFileSync(SNIPPET_PATH, "utf-8"));
  } catch (err) {
    console.log("❌ Invalid snippets.json format.");
    return {};
  }
}

//////////////////////////////////////////////////////
// Apply Snippet Engine
//////////////////////////////////////////////////////

function applySnippet(text, recipientEmail = "") {
  const snippets = loadSnippets();

  let snippetApplied = false;

  Object.keys(snippets).forEach((key) => {
    const trigger = `;${key}`;

    if (text.includes(trigger)) {
      //////////////////////////////////////////////////////
      // Extract Name (Cleaner)
      //////////////////////////////////////////////////////

      const name = recipientEmail
        .split("@")[0]
        .replace(/[0-9]/g, "")
        .replace(/[._]/g, " ");

      let template = snippets[key].replace("{{name}}", name);

      text = text.replace(trigger, template);

      console.log(`✅ Snippet '${key}' applied.`);

      snippetApplied = true;
    }
  });

  // 🚨 ONLY warn if user typed something like ;xyz
  if (!snippetApplied && text.trim().startsWith(";")) {
    console.log("⚠️ Snippet not found.");
  }

  return text;
}

module.exports = { applySnippet };
