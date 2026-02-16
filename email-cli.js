<<<<<<< HEAD
const {
  sendEmail,
  replyToEmail,
  forwardEmail,
  sendEmailWithVoice,
} = require("./send");
=======
const { sendEmail, replyToEmail, forwardEmail } = require("./send");
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
const { readEmails } = require("./read");
const { starEmail, fetchStarredEmails } = require("./star");
const { deleteEmail } = require("./delete");
const { unsendEmail } = require("./unsend");
<<<<<<< HEAD
const { startTrackingServer } = require("./track");
const searchEmails = require("./searchEmails");
const { getEmailStats } = require("./stats");
const { applyLabel } = require("./label");
const { runRules } = require("./ruleEngine");
const { composeEmail } = require("./compose");
const { voiceCompose } = require("./voiceCompose");
const { captureVoice } = require("./voiceRunner");
const { addAccount, listAccounts, switchAccount } = require("./accountManager");

=======
const { trackMailOpen } = require("./track");
const searchEmails = require("./searchEmails");
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
const {
  smartReply,
  enhanceSubject,
  changeTone,
  detectSentiment,
  translateText,
<<<<<<< HEAD
  summarizeEmail,
} = require("./huggingface-ai");
const { set } = require("date-fns");
=======
} = require("./huggingface-ai");
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  switch (command) {
    case "send":
      sendEmail(args[1], args[2], args[3], args[4]);
      break;

    case "reply":
      if (args.length < 5) {
        console.log(
          "❌ Usage: node email-cli.js reply <to> <subject> <original_body> <reply_body>"
        );
      } else {
        replyToEmail(args[1], args[2], args[3], args[4]);
      }
      break;

    case "reply-smart":
      if (args.length < 4) {
        console.log(
          "❌ Usage: node email-cli.js reply-smart <to> <subject> <original_body>"
        );
      } else {
        try {
          const reply = await smartReply(args[2], args[3]);
          replyToEmail(args[1], args[2], args[3], reply);
        } catch (err) {
          console.error("AI Error:", err);
        }
      }
      break;

<<<<<<< HEAD
    case "voice-compose":
      if (args.length < 2) {
        console.log(
          "Usage: node email-cli.js voice-compose <recipient> <subject>"
        );
        break;
      }

      const recipient = args[1];
      const subject = args[2] || "Voice Email";

      console.log("\n🎙 Start speaking. Press CTRL+C when done.\n");

      const transcript = await captureVoice();

      console.log("\n📨 Final Email Body:\n");
      console.log(transcript);

      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      readline.question("\nSend this email? (Y/N): ", async (ans) => {
        if (ans.toLowerCase() === "y") {
          await sendEmail(recipient, subject, transcript);
        } else {
          console.log("❌ Email cancelled.");
        }

        readline.close();
      });

      break;

    case "compose":
      if (args.length < 4) {
        console.log("❌ Usage: node email-cli.js compose <to> <prompt> <tone>");

        console.log(
          'Example: node email-cli.js compose manager@gmail.com "leave request" formal'
        );

        return;
      }

      await composeEmail(args[1], args[2], args[3]);
      break;

    case "voice-compose":
      if (args.length < 2) {
        console.log("Usage: node email-cli.js voice-compose <to> [subject]");
        return;
      }

      await voiceCompose(args[1], args[2] || "Voice Email");

=======
    case "subject-enhance":
      if (args.length < 2) {
        console.log("❌ Usage: node email-cli.js subject-enhance <subject>");
      } else {
        const enhanced = await enhanceSubject(args[1]);
        console.log("🧠 Enhanced Subject:", enhanced);
      }
      break;

    case "tone-change":
      if (args.length < 3) {
        console.log(
          "❌ Usage: node email-cli.js tone-change <draft_text> <tone>"
        );
      } else {
        const revised = await changeTone(args[1], args[2]);
        console.log(`🎯 Tone-Changed Draft:\n${revised}`);
      }
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
      break;

    case "sentiment":
      if (args.length < 2) {
        console.log("❌ Usage: node email-cli.js sentiment <email_body>");
      } else {
        const sentiment = await detectSentiment(args[1]);
        console.log("🧠 Sentiment:", sentiment);
      }
      break;

    case "translate":
      if (args.length < 3) {
        console.log(
          "❌ Usage: node email-cli.js translate <email_body> <language_code>"
        );
      } else {
        const translated = await translateText(args[1], args[2]);
        console.log(`🌐 Translated Text (${args[2]}):\n${translated}`);
      }
      break;

<<<<<<< HEAD
    case "summarize":
      if (args.length < 2) {
        console.log("❌ Usage: node email-cli.js summarize <email_body>");
      } else {
        const text = args.slice(1).join(" "); // supports long text

        const summary = await summarizeEmail(text);

        console.log(`📌 Email Summary:\n${summary}`);
      }
      break;

=======
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
    case "forward":
      forwardEmail(args[1], args[2], args[3]);
      break;

    case "read":
      readEmails(args[1], args[2], args[3]);
      break;

<<<<<<< HEAD
    case "stats":
      getEmailStats(args[1]);
      break;

    case "label":
      await applyLabel(args[1], args[2]);
      break;

    case "run-rules":
      await runRules();
      break;

    case "add-account":
      await addAccount();
      break;

    case "accounts":
      listAccounts();
      break;

    case "use":
      switchAccount(args[1]);
      break;

=======
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
    case "searchsender":
      searchEmails(args[1]);
      break;

    case "star":
      starEmail(args[1]);
      break;

    case "fetch":
      fetchStarredEmails();
      break;

    case "delete":
      deleteEmail(args.slice(1).join(" "));
      break;

    case "unsend":
      unsendEmail(args[1]);
      break;

<<<<<<< HEAD
    case "track-server":
      startTrackingServer();
=======
    case "track":
      trackMailOpen(args[1]);
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
      break;

    case "help":
      console.log(`
Usage:
  node email-cli.js send <to> <subject> <body> [attachment]
  node email-cli.js reply <to> <subject> <original_body> <reply_body>
  node email-cli.js reply-smart <to> <subject> <original_body>
  node email-cli.js subject-enhance <subject>
<<<<<<< HEAD
  node email-cli.js compose <to> <draft_text> <tone>
=======
  node email-cli.js tone-change <draft_text> <tone>
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
  node email-cli.js sentiment <email_body>
  node email-cli.js translate <email_body> <language_code>
  node email-cli.js forward <to> <subject> <body>
  node email-cli.js read latest 5
  node email-cli.js delete <email_id>
  node email-cli.js star <email_id>
  node email-cli.js fetch
  node email-cli.js unsend <email_id>
  node email-cli.js track <email_id>
<<<<<<< HEAD
  node email-cli.js stats [today|weekly|monthly]
  node email-cli.js label <emailId> <LABEL_NAME> 
  node email-cli.js run-rules
  node email-cli.js add-account
  node email-cli.js accounts
  node email-cli.js use <account_name>
  node email-cli.js send "sample@gmail.com" "Snippet Test" ";intro"
  node email-cli.js summarize "Client approved the budget but wants delivery by Friday."
  node email-cli.js voice-compose example@gmail.com "subject"

=======
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
`);
      break;

    default:
      console.log("❌ Unknown command. Use 'help' for usage instructions.");
  }
})();
