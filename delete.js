const { google } = require("googleapis");
const authenticate = require("./oauth2");

async function deleteEmail(query) {
  try {
    console.log("🔄 Authenticating...");
    const auth = await authenticate();

    if (!auth) {
      console.error("❌ Authentication failed. Check your credentials.");
      return;
    }

    const gmail = google.gmail({ version: "v1", auth });

    console.log(`🔍 Searching for emails with query: "${query}"...`);
    const response = await gmail.users.messages.list({
      userId: "me",
      q: query, // Search query (e.g., "from:example@gmail.com" or "subject:Hello")
    });

    const messages = response.data.messages;

    if (!messages || messages.length === 0) {
      console.log("📭 No emails found matching the query.");
      return;
    }

    console.log(`📨 Found ${messages.length} emails. Deleting...`);

    // Loop through and delete emails
    for (const message of messages) {
      try {
        await gmail.users.messages.delete({
          userId: "me",
          id: message.id,
        });
        console.log(`✅ Deleted Email ID: ${message.id}`);

        // Small delay to avoid hitting API rate limits
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error(
          `❌ Failed to delete Email ID: ${message.id} - ${err.message}`
        );
      }
    }

    console.log("🎉 Deletion completed!");
  } catch (error) {
    console.error("❌ Error deleting email:", error.message);
  }
}

module.exports = { deleteEmail };
