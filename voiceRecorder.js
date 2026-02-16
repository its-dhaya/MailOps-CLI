const { spawn } = require("child_process");
const readline = require("readline");

function recordAudio(filePath = "temp.wav") {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n🎤 Press ENTER to start recording...");

    rl.question("", () => {
      console.log("🔴 Recording... Press ENTER again to stop.");

      const ffmpeg = spawn("ffmpeg", [
        "-loglevel",
        "quiet",
        "-f",
        "dshow",
        "-i",
        "audio=Microphone Array (Intel® Smart Sound Technology for Digital Microphones)",
        "-acodec",
        "pcm_s16le",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-y",
        filePath,
      ]);

      rl.question("", () => {
        ffmpeg.kill("SIGINT");

        console.log("✅ Recording saved.");

        rl.close();

        resolve(filePath);
      });
    });
  });
}

module.exports = { recordAudio };
