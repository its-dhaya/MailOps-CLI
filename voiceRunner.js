const { spawn } = require("child_process");

function captureVoice() {
  return new Promise((resolve, reject) => {
    const py = spawn("python", ["live_transcribe.py"]);

    let transcript = "";
    let collecting = false;

    py.stdout.on("data", (data) => {
      const text = data.toString();

      process.stdout.write(text);

      if (text.includes("===FINAL_TRANSCRIPT===")) {
        collecting = true;
        transcript = text.split("===FINAL_TRANSCRIPT===")[1].trim();
      } else if (collecting) {
        transcript += " " + text.trim();
      }
    });

    py.stderr.on("data", (err) => {
      console.error("Python Error:", err.toString());
    });

    py.on("error", () => {
      reject("❌ Python not found. Install Python or add to PATH.");
    });

    py.on("close", () => {
      resolve(transcript.trim());
    });
  });
}

module.exports = { captureVoice };
