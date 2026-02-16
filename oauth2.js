const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
<<<<<<< HEAD
require("dotenv").config();

const SCOPES = [
  "https://mail.google.com/",
=======

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.full_access", // Full access required for deletion
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

<<<<<<< HEAD
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
=======
const TOKEN_PATH = path.join(__dirname, "token.json");

async function authenticate() {
  const credentials = JSON.parse(
    fs.readFileSync(path.join(__dirname, "client_secret.json"), "utf-8")
  );

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oAuth2Client.setCredentials(token);
  } else {
    await getNewToken(oAuth2Client);
  }

  return oAuth2Client;
}

async function getNewToken(oAuth2Client) {
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

<<<<<<< HEAD
  console.log("\n🔗 Open this URL in your browser and authorize the app:\n");
=======
  console.log("🔗 Open this URL in your browser and authorize the app:");
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

<<<<<<< HEAD
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
=======
  rl.question("📥 Enter the code from the browser: ", async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log("✅ Token stored successfully in token.json!");
    } catch (error) {
      console.error("❌ Error retrieving access token:", error.message);
    }
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
  });
}

module.exports = authenticate;
