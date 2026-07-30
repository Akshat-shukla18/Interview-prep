import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import uploadRoute from "./routes/upload.js";
import historyRoute from "./routes/history.js";
import rateLimit from 'express-rate-limit';
import mongoose from "mongoose";

dotenv.config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error ❌", err));



const app = express();

app.use(cors({
  origin: "https://interview-prepa.netlify.app",
  credentials: true
}));
app.use(express.json());
app.use("/upload", uploadRoute);
app.use("/api/history", historyRoute);
app.use('/chat/public', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again after 15 minutes"
}));
app.use('/send-feedback', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many feedback requests, please try again later"
}));
// app.post("/chat/public", async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message required" });
//   }

//   // Backend just replies
//   res.json({
//     reply: "Backend is connected. AI not wired yet."
//   });
// });

app.post("/chat/public", async (req, res) => {
  const { message, mode, jobTitle, experience , documentText} = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message required" });
  }

  let systemPrompt = "";
//interview mode
  if (mode === "interview") {
    systemPrompt = `
You are a professional interviewer.

Job Role: ${jobTitle}
Experience Level: ${experience}

Rules:
- Ask ONE question at a time
- Give brief feedback
- Then ask the next question
- Stay strict and realistic
`;
  } else {
    systemPrompt = `
You are a professional AI career assistant.
You help users with career guidance, resumes, skills, interviews, and job-related doubts.
Be clear, practical, and honest.
IMPORTANT:
- If the user asks for an ATS score, calculate it using the rules above
- Provide:
  1. ATS Score (out of 100)
  2. Score breakdown
  3. Strengths
  4. Weaknesses
  5. 3–5 improvement suggestions
  You MUST:
- Analyze the resume content provided
- Simulate an Applicant Tracking System (ATS) evaluation
- Provide an estimated ATS score out of 100
- Clearly explain scoring criteria

ATS SCORING RULES:
- Keyword relevance: 30%
- Skills match & clarity: 25%
- Experience clarity & impact: 20%
- Formatting & readability (ATS-safe): 15%
- Projects & achievements: 10%

If a document is provided:
- You MUST use it
- You MUST NOT say you cannot access it
- You MUST base answers on it

Your response must be structured, professional, and specific.
`;
if (documentText) {
    systemPrompt += `
The user has uploaded a document.

DOCUMENT CONTENT:
${documentText}

IMPORTANT RULES:
- Base your response strictly on the document
- Do NOT hallucinate missing information
- If details are insufficient, say so clearly
`;
  }

  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://interview-prep-4dnx.onrender.com",
          "X-Title": "AI Mentor/Interview Coach"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    // 🔥 CORRECT PARSING
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("OpenRouter empty response:", data);
      return res.json({ reply: "AI returned no response." });
    }

    res.json({ reply });

  } catch (err) {
    console.error("AI FETCH ERROR:", err);
    res.status(500).json({ reply: "AI request failed." });
  }
});


app.post('/send-feedback', async (req, res) => {
  const { name, email, rating, description } = req.body;

  // Validate input
  if (!name || !email || !rating || rating < 1 || rating > 5 || !description || description.length > 500) {
    return res.status(400).json({ error: 'Invalid input: name, email (valid), rating(1-5), description(≤500 chars)' });
  }

  // TODO: Implement nodemailer with .env config (SMTP_HOST, etc.)
  // For now: Log + success response
  console.log('Feedback received:', { name, email, rating, description });

  try {
    // Placeholder: Replace with real email service
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({ to: 'feedback@yourapp.com', ... });
    res.json({ success: true, message: 'Feedback received successfully!' });
  } catch (err) {
    console.error('Feedback send error:', err);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// console.log("AI KEY LOADED:", !!process.env.AI_API_KEY);
// console.log("KEY PREFIX:", process.env.AI_API_KEY?.slice(0, 6));


