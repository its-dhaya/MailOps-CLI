const { google } = require("googleapis");
const authenticate = require("./oauth2");

async function searchEmails(sender) {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: `from:${sender}`,
    maxResults: 5,
  });

  if (!res.data.messages) {
    console.log("📭 No emails found from this sender.");
    return;
  }

  let emailData = [];

  for (const msg of res.data.messages) {
    const email = await gmail.users.messages.get({ userId: "me", id: msg.id });
    const headers = email.data.payload.headers;

    const subject =
      headers.find((h) => h.name === "Subject")?.value || "No Subject";
    const date =
      headers.find((h) => h.name === "Date")?.value || "Unknown Date";
    const from = headers.find((h) => h.name === "From")?.value || sender;

    let messageBody = "No content available";

    // Extracting email content
    if (email.data.payload.parts) {
      const textPart = email.data.payload.parts.find(
        (part) => part.mimeType === "text/plain"
      );
      const htmlPart = email.data.payload.parts.find(
        (part) => part.mimeType === "text/html"
      );

      if (textPart && textPart.body.data) {
        messageBody = Buffer.from(textPart.body.data, "base64").toString(
          "utf-8"
        );
      } else if (htmlPart && htmlPart.body.data) {
        messageBody = Buffer.from(htmlPart.body.data, "base64").toString(
          "utf-8"
        );
      }
    } else if (email.data.payload.body && email.data.payload.body.data) {
      messageBody = Buffer.from(
        email.data.payload.body.data,
        "base64"
      ).toString("utf-8");
    }

    emailData.push({
      "🆔 ID": msg.id,
      "📅 Date & Time": date,
      "📧 From": from,
      "📜 Subject": subject,
      "📩 Message": messageBody.replace(/\n/g, " "), // Remove newlines for table formatting
    });

    // Display full message separately
    console.log(`🆔 ID: ${msg.id}`);
    console.log(`\n📩 Email from: ${from}`);
    console.log(`📅 Date: ${date}`);
    console.log(`📜 Subject: ${subject}`);
    console.log(`📩 Message:\n${messageBody}\n`);
    console.log("--------------------------------------------------------");
  }

  console.table(emailData); // Show emails in table format
}

module.exports = searchEmails;
