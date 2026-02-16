const { google } = require("googleapis");
const authenticate = require("./oauth2");

async function starEmail(emailQuery) {
  try {
    const auth = await authenticate();
    const gmail = google.gmail({ version: "v1", auth });

    // Search for the email based on query
    const response = await gmail.users.messages.list({
      userId: "me",
      q: emailQuery, // Example: "from:example@gmail.com" or "subject:Important"
    });

    const messages = response.data.messages;

    if (!messages || messages.length === 0) {
      console.log("📭 No emails found matching the query.");
      return;
    }

    // Star the first found email
    for (const message of messages) {
      await gmail.users.messages.modify({
        userId: "me",
        id: message.id,
        resource: {
          addLabelIds: ["STARRED"], // Add the "STARRED" label
        },
      });
      console.log(`⭐ Email starred: ${message.id}`);
    }
  } catch (error) {
    console.error("❌ Error starring email:", error.message);
  }
}

async function fetchStarredEmails() {
  try {
    const auth = await authenticate();
    const gmail = google.gmail({ version: "v1", auth });

    // Fetch starred emails
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:starred",
    });

    const messages = response.data.messages;

    if (!messages || messages.length === 0) {
      console.log("📭 No starred emails found.");
      return;
    }

    console.log(`🌟 Starred Emails (${messages.length} found):`);

    for (const message of messages) {
      const emailData = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full", // Fetch full email content
      });

      const headers = emailData.data.payload.headers;
      const subject =
        headers.find((header) => header.name === "Subject")?.value ||
        "No Subject";
      const from =
        headers.find((header) => header.name === "From")?.value ||
        "Unknown Sender";

      // Extract email body
      let body = "";
      if (emailData.data.payload.parts) {
        const textPart = emailData.data.payload.parts.find(
          (part) => part.mimeType === "text/plain"
        );
        if (textPart && textPart.body.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
        }
      } else if (
        emailData.data.payload.body &&
        emailData.data.payload.body.data
      ) {
        body = Buffer.from(emailData.data.payload.body.data, "base64").toString(
          "utf-8"
        );
      }

      console.log(`\n📩 **Email Details**`);
      console.log(`🔹 From: ${from}`);
      console.log(`📌 Subject: ${subject}`);
      console.log(`📝 Body:\n${body.substring(0, 500)}...`); // Show first 500 chars
    }
  } catch (error) {
    console.error("❌ Error fetching starred emails:", error.message);
  }
}

module.exports = { starEmail, fetchStarredEmails };
