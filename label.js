const authenticate = require("./oauth2");
const { google } = require("googleapis");

async function applyLabel(emailId, labelName) {
  try {
    if (!emailId || !labelName) {
      console.log("Usage: node email-cli.js label <emailId> <LABEL_NAME>");
      return;
    }

    const auth = await authenticate();
    const gmail = google.gmail({ version: "v1", auth });
    const isEmail = emailId.includes("@");

    labelName = labelName.toUpperCase();

    // Get labels
    const labelsRes = await gmail.users.labels.list({
      userId: "me",
    });

    let label = labelsRes.data.labels.find((l) => l.name === labelName);

    // Create if not exists
    if (!label) {
      const newLabel = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });

      label = newLabel.data;
    }

    if (isEmail) {
      const res = await gmail.users.messages.list({
        userId: "me",
        q: `from:${emailId}`,
        maxResults: 100, // can increase later
      });

      const messages = res.data.messages || [];

      if (messages.length === 0) {
        console.log("📭 No emails found from this sender.");
        return;
      }

      for (const msg of messages) {
        await gmail.users.messages.modify({
          userId: "me",
          id: msg.id,
          requestBody: {
            addLabelIds: [label.id],
          },
        });
      }

      console.log(
        `✅ Label applied to ${messages.length} emails from ${emailId}`
      );

      return;
    }

    // Apply label
    await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      requestBody: {
        addLabelIds: [label.id],
      },
    });

    console.log(`✅ Label "${labelName}" applied successfully!`);
  } catch (err) {
    console.error("❌ Error applying label:", err.message);
  }
}

module.exports = { applyLabel };
