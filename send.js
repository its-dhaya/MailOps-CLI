//////////////////////////////////////////////////////
// 📦 Imports
//////////////////////////////////////////////////////

const authenticate = require("./oauth2");
const { google } = require("googleapis");
const notifier = require("node-notifier");
const path = require("path");
const fs = require("fs");
const { applySnippet } = require("./snippetManager");

//////////////////////////////////////////////////////
// ✅ Parse Multiple Emails (VERY IMPORTANT)
//////////////////////////////////////////////////////

function parseRecipients(to) {
  return to
    .split(/[,\s]+/) // comma OR space
    .map((e) => e.trim())
    .filter(Boolean);
}

//////////////////////////////////////////////////////
// 📎 Build MIME Message
//////////////////////////////////////////////////////

function buildMimeMessage(to, subject, body, attachments = []) {
  const boundary = "__MY_BOUNDARY__";

  let messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ];

  attachments.forEach((file) => {
    try {
      const fileContent = fs.readFileSync(file.path).toString("base64");
      const filename = path.basename(file.path);

      messageParts.push(
        "",
        `--${boundary}`,
        `Content-Type: application/octet-stream; name="${filename}"`,
        "Content-Transfer-Encoding: base64",
        `Content-Disposition: attachment; filename="${filename}"`,
        "",
        fileContent
      );
    } catch (err) {
      console.error(`❌ Failed to attach file: ${file.path}`, err.message);
    }
  });

  messageParts.push(`--${boundary}--`);

  return Buffer.from(messageParts.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

//////////////////////////////////////////////////////
// ✉️ SEND EMAIL (OAuth Powered)
//////////////////////////////////////////////////////

async function sendEmail(to, subject, body, attachments = null) {
  try {
    const auth = await authenticate();
    const gmail = google.gmail({ version: "v1", auth });

    //////////////////////////////////////////////////////
    // ✅ Normalize Recipients
    //////////////////////////////////////////////////////

    const recipients = parseRecipients(to);

    if (!recipients.length) {
      console.log("❌ No valid recipients.");
      return;
    }

    //////////////////////////////////////////////////////
    // ✅ Apply snippet ONLY using first email
    //////////////////////////////////////////////////////

    body = applySnippet(body, recipients[0]);

    //////////////////////////////////////////////////////
    // Attachments
    //////////////////////////////////////////////////////

    let attachmentList = [];

    if (attachments && attachments !== "no-attachment") {
      const files = attachments.split(",");

      for (const file of files) {
        const normalized = path.resolve(file.trim().replace(/^"|"$/g, ""));

        if (fs.existsSync(normalized)) {
          attachmentList.push({ path: normalized });
        } else {
          console.log(`❌ Attachment not found: ${normalized}`);

          notifier.notify({
            title: "MailOps",
            message: `Attachment not found: ${path.basename(normalized)}`,
          });
        }
      }
    }

    //////////////////////////////////////////////////////
    // Build MIME
    //////////////////////////////////////////////////////

    const rawMessage = buildMimeMessage(
      recipients.join(", "), // ⭐ Gmail expects comma separated
      subject,
      body,
      attachmentList
    );

    //////////////////////////////////////////////////////
    // SEND
    //////////////////////////////////////////////////////

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage },
    });

    console.log("✅ Email sent successfully via OAuth!");

    notifier.notify({
      title: "MailOps",
      message: "Email sent successfully!",
    });

    process.exit(0); // exit LAST
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);

    notifier.notify({
      title: "MailOps",
      message: "Failed to send email!",
    });

    process.exit(1);
  }
}

//////////////////////////////////////////////////////
// 🔁 Reply
//////////////////////////////////////////////////////

async function replyToEmail(to, originalSubject, replyBody) {
  const subject = originalSubject.startsWith("Re:")
    ? originalSubject
    : `Re: ${originalSubject}`;

  await sendEmail(to, subject, replyBody);
}

//////////////////////////////////////////////////////
// 📤 Forward
//////////////////////////////////////////////////////

async function forwardEmail(to, originalSubject, forwardBody) {
  const subject = originalSubject.startsWith("Fwd:")
    ? originalSubject
    : `Fwd: ${originalSubject}`;

  await sendEmail(to, subject, forwardBody);
}

//////////////////////////////////////////////////////
// 📦 Exports
//////////////////////////////////////////////////////

module.exports = {
  sendEmail,
  replyToEmail,
  forwardEmail,
};
