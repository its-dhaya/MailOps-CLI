const authenticate = require("./oauth2");
const { google } = require("googleapis");
const { changeTone } = require("./huggingface-ai"); // or AI service
const { sendEmail } = require("./send");
const readline = require("readline");

async function askConfirmation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("\nSend email? (Y/N): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

async function composeEmail(to, prompt, tone) {
  const auth = await authenticate();
  const gmail = google.gmail({ version: "v1", auth });

  // Fetch sender
  const profile = await gmail.users.getProfile({ userId: "me" });

  const senderEmail = profile.data.emailAddress;

  const senderName = senderEmail
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .replace(/[._]/g, " ");

  const managerName = to
    .split("@")[0]
    .replace(/[0-9]/g, "")
    .replace(/[._]/g, " ");

  //////////////////////////////////////////////////////
  // SMART PROMPT
  //////////////////////////////////////////////////////

  const smartPrompt = `
  You are an intelligent email assistant.
  
  Write a ${tone} email.
  
  Guidelines:
  - Sound natural and human
  - Avoid robotic corporate language
  - Avoid unnecessary filler sentences
  - Keep it clear and purposeful
  - Do NOT use placeholders
  
  Context:
  Recipient Name: ${managerName}
  Sender Name: ${senderName}
  
  User Request:
  ${prompt}
  
  IMPORTANT:
  Use the real names in greeting and closing.
  Generate both subject and body.
  `;

  const composed = await changeTone(smartPrompt, tone);

  console.log("\n📧 Generated Email:\n");
  console.log(composed);

  const confirm = await askConfirmation();

  if (!confirm) {
    console.log("❌ Email cancelled.");
    return;
  }

  await sendEmail(to, "Regarding your request", composed);
}

module.exports = { composeEmail };
