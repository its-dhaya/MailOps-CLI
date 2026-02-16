const { google } = require("googleapis");
const authenticate = require("./oauth2");

async function unsendEmail(emailId) {
  console.log("Attempting to unsend email...");
  // Simulate recall (Gmail API does not support recall)
  deleteEmail(emailId);
  console.log("Unsend feature is limited on Gmail.");
}

module.exports = { unsendEmail };
