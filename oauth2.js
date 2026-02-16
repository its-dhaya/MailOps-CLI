const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
require("dotenv").config();

const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

const TOKENS_DIR = path.join(__dirname, "tokens");
const ACTIVE_ACCOUNT_PATH = path.join(__dirname, "activeAccount.json");

async function authenticate() {
  try {
    // ✅ Ensure tokens folder exists
    if (!fs.existsSync(TOKENS_DIR)) {
      fs.mkdirSync(TOKENS_DIR);
    }

    // ✅ Ensure active account exists
    if (!fs.existsSync(ACTIVE_ACCOUNT_PATH)) {
      throw new Error(
        "❌ No active account found. Run 'node email-cli.js add-account' first."
      );
    }

    const { account } = JSON.parse(
      fs.readFileSync(ACTIVE_ACCOUNT_PATH, "utf-8")
    );

    const tokenPath = path.join(TOKENS_DIR, `${account}.json`);

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // ✅ Load token if exists
    if (fs.existsSync(tokenPath)) {
      const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
      oAuth2Client.setCredentials(token);
    } else {
      await getNewToken(oAuth2Client, tokenPath);
    }

    return oAuth2Client;
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    process.exit(1);
  }
}

async function getNewToken(oAuth2Client, tokenPath) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("\n🔗 Open this URL in your browser and authorize the app:\n");
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question("\n📥 Enter the code from the browser: ", async (code) => {
      rl.close();

      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

        console.log("✅ Token stored successfully!");

        resolve();
      } catch (error) {
        reject("❌ Error retrieving access token: " + error.message);
      }
    });
  });
}

module.exports = authenticate;
