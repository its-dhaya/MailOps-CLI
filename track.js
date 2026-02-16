const express = require("express");
const fs = require("fs");

<<<<<<< HEAD
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
=======
const app = express();

app.get("/track", (req, res) => {
  const email = req.query.email || "Unknown";
  const logEntry = `${new Date().toISOString()} - Opened: ${email}\n`;

  // Log the event
  console.log(logEntry);
  fs.appendFileSync("email-cli.log", logEntry);

  // Send a 1x1 transparent GIF instead of an empty buffer (to avoid email filtering)
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

app.listen(3000, () => console.log("📡 Tracking server running on port 3000"));
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
