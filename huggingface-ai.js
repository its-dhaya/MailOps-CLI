require("dotenv").config();
const OpenAI = require("openai");

//////////////////////////////////////////////////////
// Groq Client
//////////////////////////////////////////////////////
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

//////////////////////////////////////////////////////
// CURRENT BEST FAST MODEL
//////////////////////////////////////////////////////

// Ultra fast + cheap + perfect for email tools
const MODEL = "llama-3.1-8b-instant";

// If you want more intelligence later, switch to:
// const MODEL = "llama-3.3-70b-versatile";

//////////////////////////////////////////////////////
// Master AI Caller
//////////////////////////////////////////////////////
async function queryAI(prompt) {
  try {
    const completion = await client.chat.completions.create({
      model: MODEL,

      messages: [
        {
          role: "system",
          content: `
You are an elite AI email assistant.

Rules:
- Be professional
- Be clear
- Avoid fluff
- Do not over-explain
- Keep responses practical
- Do NOT add commentary
- Output only the final answer
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2, // lower = more professional
      max_tokens: 250, // prevents essay responses
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.log("🔥 GROQ ERROR:");
    console.log(err?.response?.data || err.message);

    return "⚠️ AI service temporarily unavailable.";
  }
}

//////////////////////////////////////////////////////
// Tone Change
//////////////////////////////////////////////////////
async function changeTone(text, tone = "formal") {
  return queryAI(`
Rewrite the following email in a ${tone} tone.

Email:
${text}
`);
}

//////////////////////////////////////////////////////
// Smart Reply
//////////////////////////////////////////////////////
async function smartReply(subject, body) {
  return queryAI(`
Write a professional reply to this email.

Subject: ${subject}

Email:
${body}
`);
}

//////////////////////////////////////////////////////
// Subject Enhancement
//////////////////////////////////////////////////////
async function enhanceSubject(subject) {
  return queryAI(`
Improve this email subject line to sound professional and clear:

${subject}
`);
}

//////////////////////////////////////////////////////
// Sentiment Detection
//////////////////////////////////////////////////////
async function detectSentiment(text) {
  return queryAI(`
Classify this email as:

Positive
Negative
Neutral

Return ONLY one word.

Email:
${text}
`);
}

//////////////////////////////////////////////////////
// Translation
//////////////////////////////////////////////////////
async function translateText(text, lang) {
  return queryAI(`
Translate ONLY the text below into ${lang}.

Rules:
- Do NOT expand
- Do NOT add templates
- Do NOT rewrite
- Do NOT explain
- Return ONLY the translated text

Text:
${text}
`);
}

//////////////////////////////////////////////////////
// Summarize Email
//////////////////////////////////////////////////////
async function summarizeEmail(text) {
  return queryAI(`
Summarize the email below in a structured format.

RULES:
- Be concise
- Do NOT add information
- Do NOT hallucinate
- Focus only on what is written

FORMAT:

Key Points:
- bullet points only

Action Items:
- bullet points only (write "None" if no action is needed)

Email:
${text}
`);
}

//////////////////////////////////////////////////////

module.exports = {
  smartReply,
  enhanceSubject,
  changeTone,
  detectSentiment,
  translateText,
  summarizeEmail,
};
