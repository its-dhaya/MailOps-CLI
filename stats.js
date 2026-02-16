const authenticate = require("./oauth2");
const { google } = require("googleapis");

async function getEmailStats(period = "today") {
  try {
    const auth = await authenticate();
    const gmail = google.gmail({ version: "v1", auth });

    let query = "";

    switch (period) {
      case "weekly":
        query = "newer_than:7d";
        break;

      case "monthly":
        query = "newer_than:30d";
        break;

      case "today":
      default:
        query = "newer_than:1d";
    }

    const received = await gmail.users.messages.list({
      userId: "me",
      q: query,
    });

    const unread = await gmail.users.messages.list({
      userId: "me",
      q: `is:unread ${query}`,
    });

    const sent = await gmail.users.messages.list({
      userId: "me",
      q: `in:sent ${query}`,
    });

    console.log(`\n📊 Email Stats (${period.toUpperCase()})\n`);

    console.log(`✅ Received: ${received.data.messages?.length || 0}`);
    console.log(`📬 Unread: ${unread.data.messages?.length || 0}`);
    console.log(`📤 Sent: ${sent.data.messages?.length || 0}`);
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

module.exports = { getEmailStats };
