const authenticate = require("./oauth2");
const { google } = require("googleapis");
const Table = require("cli-table3");
const wrap = require("word-wrap");

async function readEmails(mode, param1, param2) {
  try {
    const auth = await authenticate(); // Ensure authentication
    const gmail = google.gmail({ version: "v1", auth });

    let maxResults = 5;
    let query = "";

    // ✅ Handle different read modes correctly
    if (mode === "latest") {
      maxResults = parseInt(param1) || 5;
    } else if (mode === "all" && param1 && param2) {
      query = `after:${formatDate(param1)} before:${formatDate(param2, true)}`;
    } else if (mode === "on" && param1) {
      const dateStart = formatDate(param1);
      const dateEnd = formatDate(param1, true);
      query = `after:${dateStart} before:${dateEnd}`;
    } else {
      console.error("❌ ERROR: Invalid command usage. Try:");
      console.log("  node email-cli.js read latest 5");
      console.log("  node email-cli.js read all YYYY-MM-DD YYYY-MM-DD");
      console.log("  node email-cli.js read on YYYY-MM-DD");
      return;
    }

    // ✅ Fetch messages from Gmail API
    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: maxResults,
      q: query,
    });

    const messages = response.data.messages || [];
    if (messages.length === 0) {
      console.log("📭 No emails found.");
      return;
    }

    // ✅ Create a table for displaying emails
    const table = new Table({
<<<<<<< HEAD
      head: ["🆔 ID", "📩 Subject", "👤 From", "📜 Snippet", "📅 Date"],
      colWidths: [20, 32, 28, 55, 24],
=======
      head: ["📩 Subject", "👤 From", "📜 Snippet", "📅 Date Received"],
      colWidths: [40, 30, 60, 25],
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
      wordWrap: true,
    });

    for (let msg of messages) {
      const messageData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const payload = messageData.data.payload;
      const headers = payload.headers;

      const subject =
        headers.find((header) => header.name === "Subject")?.value ||
        "No Subject";
      const from =
        headers.find((header) => header.name === "From")?.value ||
        "Unknown Sender";
      let snippet = messageData.data.snippet || "No preview available";
      snippet = wrap(snippet, { width: 55, indent: "" });

      const dateHeader =
        headers.find((header) => header.name === "Date")?.value ||
        "Unknown Date";
      const receivedDate = new Date(dateHeader).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

<<<<<<< HEAD
      table.push([msg.id, subject, from, snippet, receivedDate]);
=======
      table.push([subject, from, snippet, receivedDate]);
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
    }

    console.log(table.toString());
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

// ✅ Function to format date for Gmail API
function formatDate(dateStr, endOfDay = false) {
  const date = new Date(dateStr);
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return Math.floor(date.getTime() / 1000); // Convert to UNIX timestamp
}

module.exports = { readEmails };
