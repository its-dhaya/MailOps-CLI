require("dotenv").config();
<<<<<<< HEAD
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

=======
const axios = require("axios");

const HUGGINGFACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const headers = {
  Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
};

const HF_API_URL = "https://api-inference.huggingface.co/models";

// Smart Reply
async function smartReply(subject, body) {
  const input = `Reply to this email:\nSubject: ${subject}\n${body}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No reply generated.";
}

// Enhance Subject
async function enhanceSubject(subject) {
  const input = `Enhance this subject line to make it more engaging: "${subject}"`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No enhancement provided.";
}

// Change Tone
async function changeTone(text, tone = "formal") {
  const input = `Rewrite this email in a ${tone} tone:\n${text}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No tone-changed version.";
}

// Detect Sentiment
async function detectSentiment(text) {
  const input = `Detect the sentiment of this email:\n${text}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No sentiment detected.";
}

// Translate Text
async function translateText(text, langCode = "fr") {
  const input = `Translate the following email to ${langCode}:\n${text}`;
  const res = await axios.post(
    `${HF_API_URL}/mistralai/Mixtral-8x7B-Instruct-v0.1`,
    { inputs: input },
    { headers }
  );
  return res.data?.[0]?.generated_text || "⚠️ No translation provided.";
}

>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
module.exports = {
  smartReply,
  enhanceSubject,
  changeTone,
  detectSentiment,
  translateText,
<<<<<<< HEAD
  summarizeEmail,
=======
>>>>>>> 53f6f5ba2ee967fd3795b2a0bdf2197fc657c284
};
