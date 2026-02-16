const readline = require("readline");
const { captureVoice } = require("./voiceRunner");
const { sendEmail } = require("./send");

//////////////////////////////////////////////////////
// ✅ Parse Multiple Emails (VERY IMPORTANT)
//////////////////////////////////////////////////////

function parseRecipients(to) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const recipients = to
    .split(/[,\s]+/) // supports comma OR space
    .map((email) => email.trim())
    .filter(Boolean);

  const validRecipients = recipients.filter((email) => emailRegex.test(email));

  if (!validRecipients.length) {
    console.log("❌ No valid email addresses found.");
    process.exit(0);
  }

  return validRecipients;
}

//////////////////////////////////////////////////////
// 🎙 Voice Compose
//////////////////////////////////////////////////////

async function voiceCompose(to, subject = "Voice Email") {
  try {
    //////////////////////////////////////////////////////
    // ✅ Normalize Emails
    //////////////////////////////////////////////////////

    const recipients = parseRecipients(to);

    console.log("\n📨 Recipients:");
    recipients.forEach((mail) => console.log(`✔ ${mail}`));

    console.log(
      "\n🎙 Start speaking... Recording stops automatically after silence.\n"
    );

    //////////////////////////////////////////////////////
    // 🎤 Capture Voice
    //////////////////////////////////////////////////////

    const body = await captureVoice();

    if (!body) {
      console.log("❌ No speech detected.");
      process.exit(0);
    }

    //////////////////////////////////////////////////////
    // ✅ Preview Email
    //////////////////////////////////////////////////////

    console.log("\n━━━━━━━━ EMAIL PREVIEW ━━━━━━━━\n");

    console.log("To:", recipients.join(", "));
    console.log("Subject:", subject);
    console.log("\nBody:\n");
    console.log(body);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    //////////////////////////////////////////////////////
    // ✅ Confirmation Prompt
    //////////////////////////////////////////////////////

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Send this email? (Y/N): ", async (answer) => {
      rl.close();

      if (answer.toLowerCase() === "y") {
        await sendEmail(recipients.join(","), subject, body);

        console.log("✅ Voice email sent successfully!");
      } else {
        console.log("❌ Email cancelled.");
      }

      process.exit(0); // VERY important for CLI tools
    });
  } catch (err) {
    console.error("❌ Voice compose failed:", err);
    process.exit(1);
  }
}

module.exports = { voiceCompose };
