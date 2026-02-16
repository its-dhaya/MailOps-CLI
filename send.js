<<<<<<< HEAD
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
=======
const nodemailer = require("nodemailer");
const notifier = require("node-notifier");
const path = require("path");
const fs = require("fs");
const recorder = require("node-record-lpcm16");
const speech = require("@google-cloud/speech");
require("dotenv").config();

const client = new speech.SpeechClient();

// 🎤 Convert speech to text
async function voiceToText(languageCode = "en-US") {
  return new Promise((resolve, reject) => {
    const request = {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode,
      },
    };

    console.log(
      `🎤 Speak your email in ${languageCode} (Press Ctrl+C to stop)...`
    );
    const recognizeStream = client
      .streamingRecognize(request)
      .on("data", (data) => {
        console.log(
          "📝 Transcribed:",
          data.results[0].alternatives[0].transcript
        );
        resolve(data.results[0].alternatives[0].transcript);
      })
      .on("error", (err) => reject(err));

    recorder.record({ sampleRate: 16000 }).stream().pipe(recognizeStream);
  });
}

// 💬 Text formatting helper
function formatTextToHtml(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\n/g, "<br>");
}

// ✉️ Core function to send email
async function sendEmail(to, subject, body, attachments = null) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let formattedBody = formatTextToHtml(body);

  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: to.split(","),
    subject,
    html: `${formattedBody}<br><img src="https://yourserver.com/track?email=${to}" width="1" height="1">`,
  };

  if (attachments && attachments !== "no-attachment") {
    let files = attachments.split(",");
    let attachmentList = [];

    files.forEach((file) => {
      const normalizedPath = path.resolve(file.trim().replace(/^"|"$/g, ""));
      if (fs.existsSync(normalizedPath)) {
        attachmentList.push({ path: normalizedPath });
      } else {
        console.error(`❌ Attachment not found: ${normalizedPath}`);
        notifier.notify({
          title: "Email CLI",
          message: "❌ Attachment not found!",
          sound: true,
        });
      }
    });

    if (attachmentList.length > 0) {
      mailOptions.attachments = attachmentList;
    }
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    notifier.notify({
      title: "Email CLI",
      message: "✅ Email sent successfully!",
      sound: true,
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    notifier.notify({
      title: "Email CLI",
      message: "❌ Failed to send email!",
      sound: true,
    });
  }
}

// 🎤 Voice email function
async function sendEmailWithVoice(to, subject, language = "en-US") {
  try {
    const emailBody = await voiceToText(language);
    await sendEmail(to, subject, emailBody);
  } catch (error) {
    console.error("❌ Error in voice-to-text:", error);
  }
}

// 🔁 Reply to an email
async function replyToEmail(to, originalSubject, replyBody) {
  const replySubject = originalSubject.startsWith("Re:")
    ? originalSubject
    : `Re: ${originalSubject}`;
  await sendEmail(to, replySubject, replyBody);
}

// 📤 Forward an email
async function forwardEmail(to, originalSubject, forwardBody) {
  const forwardSubject = originalSubject.startsWith("Fwd:")
    ? originalSubject
    : `Fwd: ${originalSubject}`;
  await sendEmail(to, forwardSubject, forwardBody);
}

module.exports = {
  sendEmail,
  sendEmailWithVoice,
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
  replyToEmail,
  forwardEmail,
};
