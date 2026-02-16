const express = require("express");
const fs = require("fs");

function startTrackingServer() {
  const app = express();

  app.get("/track", (req, res) => {
    const email = req.query.email || "Unknown";
    const logEntry = `${new Date().toISOString()} - Opened: ${email}\n`;

    console.log(logEntry);
    fs.appendFileSync("email-cli.log", logEntry);

    const transparentGif = Buffer.from(
      "R0lGODlhAQABAPAAACAgIP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
      "base64"
    );

    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": transparentGif.length,
    });

    res.end(transparentGif);
  });

  app.listen(3000, () =>
    console.log("📡 Tracking server running on port 3000")
  );
}

module.exports = { startTrackingServer };
