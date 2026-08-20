# 🤖 AI Interview Preparation — 

> Your dedicated AI partner for interview preparation, career guidance, and placement success.

Crack interviews smarter. **Interview Prep** is a full-stack, AI-powered interview preparation and career coaching platform that combines a **realistic AI interview simulator**, an **AI career assistant**, **resume/ATS analysis**, **voice interactions**- all in one immersive experience.

Confidence can't be built in one day… but it can be built *one day at a time* — and AI-Interview preparation is here to help you practice every step of the way. 🚀

---

## ✨ What We Provide

| Capability | Description |
|---|---|
| 💬 **AI Career Assistant (Chat Mode)** | Ask career-related questions, get learning roadmaps, resume advice, skill recommendations, and job-related doubts answered instantly. |
| 🧾 **Interview Mode Simulator** | A realistic, one-question-at-a-time interview driven by your **job role** and **experience level**. The AI asks, evaluates your answers, gives brief feedback, and keeps going like a real interviewer. |
| 📄 **Resume & Document Analysis** | Upload **PDF, DOCX, or TXT** resumes and get an **ATS Score (out of 100)**, score breakdown, strengths, weaknesses, and 3–5 actionable improvement suggestions. |
| 🎤 **Voice Input** | Speak your answers using the Web Speech API (Speech Recognition) instead of typing. |
| 🗣 **AI Text-to-Speech** | The interviewer **reads questions aloud** using browser Speech Synthesis, making practice feel truly realistic. |
| 🧍 **3D Animated Avatar** | A 3D avatar powered by **Three.js / react-three-fiber** that reacts to your session — idle, listening, and talking states. |
| 📊 **Interview Report** | End any interview session to receive a **performance score (/10)**, areas to improve, candidate qualities, and a Q&A recap. |
| ⏱ **Live Interview Timer** | Track your responses with a built-in stopwatch during mock interviews. |
| 🔐 **Secure Authentication** | Sign up / log in with **Email/Password or Google** via Firebase Auth. |
| 🗂 **Chat History** | Save your chat sessions, view past conversations, resume them, and delete them anytime. |
| 💌 **Feedback System** | Rate the platform and send feedback to the developer — right from the app. |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [React 19](https://react.dev/) · [Vite](https://vite.dev/) (Rolldown-Vite) · JavaScript (JSX) |
| **3D / Animation** | [Three.js](https://threejs.org/) · [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) · [@react-three/drei](https://drei.pmnd.rs/) · [GSAP](https://greensock.com/gsap/) |
| **AI / LLM** | [OpenRouter API](https://openrouter.ai/) (`openai/gpt-3.5-turbo`) with custom prompt engineering |
| **Backend** | [Node.js](https://nodejs.org/) · [Express 5](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) · [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [Firebase Auth](https://firebase.google.com/products/auth) (Email/Password + Google) |
| **File Parsing** | [Multer](https://github.com/expressjs/multer) · [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) (PDF) · [Mammoth](https://github.com/mwilliamson/mammoth.js) (DOCX) |
| **Voice** | Web Speech API — `SpeechRecognition` (input) + `SpeechSynthesis` (output) |
| **Styling** | Custom CSS (`App.css`, `landing.css`, component-level stylesheets) |
| **Security** | [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) · CORS · `.env` protected |
| **Other** | [axios](https://axios-http.com/) · [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm · Nodemailer |

---

## 🏗 Project Structure

```
Interview-Ai/
│
├── .gitignore
├── package.json                  # Root package (3D/AI client deps)
├── README.md
│
├── frontend/                     # ─── React + Vite SPA ───
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   │
│   ├── public/
│   │   ├── models/avatar.glb     # 3D avatar model
│   │   ├── bgvideo.mp4           # Background video
│   │   ├── welcome.mp3           # Landing audio
│   │   └── *.jpg / *.png         # Static images
│   │
│   └── src/
│       ├── main.jsx              # App entry + AuthProvider
│       ├── App.jsx               # Main shell (chat + interview UX)
│       ├── Landing.jsx           # Landing page
│       ├── TextType.jsx          # Typewriter heading effect
│       ├── speak.js              # Text-to-Speech helper
│       ├── firebase.js           # Firebase config + Auth exports
│       ├── index.css / App.css / landing.css
│       │
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state (user, logout)
│       │
│       └── components/
│           ├── Avatar/
│           │   ├── AvatarCanvas.jsx     # R3F canvas + camera control
│           │   ├── AvatarModel.jsx      # Loads avatar.glb + animations
│           │   ├── avatarStates.js      # IDLE / LISTENING / TALKING
│           │   ├── Auth/AuthModal.jsx   # Login/Signup modal (Google + email)
│           │   ├── CardSwap/            # GSAP card-swap animation
│           │   ├── Feedback/FeedbackModal.jsx  # Star-rating feedback
│           │   └── Help/help.jsx        # Help / About screen
│           └── HistoryPanel/
│               └── HistoryPanel.jsx     # Saved chat sessions sidebar
│
└── server/                       # ─── Express API ───
    ├── index.js                  # Server entry, AI chat, feedback, rate limits
    ├── package.json
    │
    ├── models/
    │   └── ChatHistory.js        # Mongoose schema for saved chats
    │
    └── routes/
        ├── upload.js             # PDF / DOCX / TXT → text extraction
        └── history.js            # Save / fetch / delete chat history
```

---

## 🏛 High-Level Design

AI-Robo uses a **client–server architecture** with a React SPA talking to an Express API, which in turn orchestrates the AI model and the database.

```
┌──────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React/Vite)                       │
│   Landing ─▶ App ─▶ ┌─ Chat Mode (AI Career Assistant)               │
│                     └─ Interview Mode (Simulator + 3D Avatar)        │
│   • Firebase Auth (Google / Email)      • Speech Recognition (🎤)    │
│   • Speech Synthesis (🗣)                 • GSAP / R3F 3D Avatar      │
└───────────────┬──────────────────────────────────────────────────────┘
                │  HTTPS / REST (axios / fetch)
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express 5 / Node.js)                   │
│   ┌──────────────┐   ┌────────────────┐   ┌─────────────────────┐    │
│   │ /chat/public │──▶│  OpenRouter AI │   │ /upload (Multer +   │    │
│   │  (rate-limit)│   │  GPT-3.5-Turbo │   │  pdfjs / mammoth)   │    │
│   └──────────────┘   └────────────────┘   └─────────────────────┘    │
│   ┌────────────────────────────────────────────────────────────────┐  │
│   │ /api/history  ──▶  MongoDB (Mongoose)     /send-feedback        │  │
│   └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User authenticates** via Firebase (optional for reading, required for chat/saving).
2. In **Chat Mode**, the user types or speaks a question, optionally attaches a resume (PDF/DOCX/TXT).
   - The file is sent to `POST /upload` → extracted to plain text (≤ 6000 chars).
   - Chat messages + document text are sent to `POST /chat/public`.
   - The server builds a **system prompt** (career coach **or** ATS analyzer) and forwards it to **OpenRouter**.
   - The AI reply is returned and rendered with **Markdown** formatting.
3. In **Interview Mode**, the user picks a **job title** and **experience level**.
   - The AI acts as a strict professional interviewer — asking **one question at a time** and giving brief feedback.
   - The interviewer **speaks** each question aloud, and users answer via **text or voice**.
   - A live **timer** tracks the session; ending the session generates a **performance report**.
4. Chat sessions can be **saved** to MongoDB and reloaded anytime from the **History Panel**.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Firebase** project (for Auth)
- An **OpenRouter** API key

### 1. Clone & Install

```bash
git clone https://github.com/Akshat-shukla18/AI-robo.git
cd AI-robo

# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Server** — create `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-robo
AI_API_KEY=your_openrouter_api_key
```

**Frontend** — create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Locally

**Terminal 1 — Backend:**

```bash
cd server
npm start
# → Server running on port 5000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
# → Vite dev server (usually http://localhost:5173)
```

Open the printed URL in your browser and click **Get Started** to enter the app.

---

## 🔑 Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `MONGO_URI` | `server/.env` | MongoDB connection string |
| `AI_API_KEY` | `server/.env` | OpenRouter API key for the LLM |
| `VITE_API_URL` | `frontend/.env.local` | Base URL of the Express backend |
| `VITE_FIREBASE_API_KEY` | `frontend/.env.local` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `frontend/.env.local` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `frontend/.env.local` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `frontend/.env.local` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `frontend/.env.local` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | `frontend/.env.local` | Firebase app ID |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat/public` | Send a message to the AI (chat or interview mode). *Rate-limited to 50 req / 15 min.* |
| `POST` | `/upload` | Upload a file (`PDF`, `DOCX`, `TXT` ≤ 3 MB) and receive extracted text. |
| `GET` | `/api/history?userId=...` | Fetch a user's saved chat history (latest 10 sessions). |
| `POST` | `/api/history/save` | Save a chat session (`userId`, `messages`, `summary`). |
| `DELETE` | `/api/history/:id` | Delete a saved chat session. |
| `POST` | `/send-feedback` | Submit user feedback (rating 1–5 + description ≤ 500 chars). *Rate-limited to 5 req / 15 min.* |

---

## 🧠 How It Works

### 💬 Chat Mode (AI Assistance)

- Default landing experience — a conversational **AI Career Assistant**.
- Handles career guidance, skill roadmaps, resume advice, and general questions.
- Supports **document upload → AI analysis** including **ATS scoring** with a clear breakdown:
  - Keyword relevance — **30%** · Skills match & clarity — **25%** · Experience clarity & impact — **20%** · Formatting / ATS-safe — **15%** · Projects & achievements — **10%**
- Responses are rendered with **Markdown** for readable, structured answers.

### 🧾 Interview Mode (Simulator)

1. Choose **Job Title** + **Experience Level** (0–1, 2–3, 4–6, 7+ years).
2. The AI interviewer asks **one question at a time** (starting with *"Introduce yourself."*).
3. Respond by **typing** or through **speech-to-text** (🎤 mic button).
4. The AI **speaks** each question aloud, evaluates your answer, gives brief feedback, then moves on.
5. Exit at any time to **Evaluate** — generate a detailed report:
   - Performance score **/10** (based on participation, answer depth & duration)
   - **Areas to Improve** and **Candidate Qualities** (auto-detected from your answers)
   - Question & Answer recap (top 5)

---

## 🌐 Deployment

The app is designed to deploy with separate hosting for frontend and backend:

- **Frontend:** [Netlify](https://www.netlify.com/) — build command `npm run build`, publish directory `dist`.  
  Live: `https://interview-prepa.netlify.app`
- **Backend:** [Render](https://render.com/) (or Railway / Heroku) — start command `npm start`.  
  Live: `https://interview-prep-4dnx.onrender.com`

> ⚠️ When deploying, update the **CORS origin** in `server/index.js` and the `VITE_API_URL` in your frontend build to match your production URLs.

---

## 👨‍💻 Authors

**Akshat Shukla** — Developer & Creator of AI-Robo

- 🌐 GitHub: [@Akshat-shukla18](https://github.com/Akshat-shukla18)
- 📦 Repository: [https://github.com/Akshat-shukla18/AI-robo](https://github.com/Akshat-shukla18/AI-robo)
- 📧 Email: [akweb2025@gmail.com](mailto:akweb2025@gmail.com)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a **Pull Request**.

Found a bug or have a suggestion? Open an [issue](https://github.com/Akshat-shukla18/AI-robo/issues) or send feedback right from the app. 💌

---

## 📜 License

This project is for educational and personal use. Please reach out to the author before redistributing or using it commercially.

---

**Practice. Improve. Crack it.** ✨

