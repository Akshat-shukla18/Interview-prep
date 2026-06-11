
import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
  import { useRef } from "react";
  import AuthModal from "./components/Avatar/Auth/AuthModal";
  import { useAuth } from "./context/AuthContext";
  import remarkGfm from "remark-gfm";
  import AvatarCanvas from "./components/Avatar/AvatarCanvas";
  import { AVATAR_STATES } from "./components/Avatar/avatarStates";
  // import ModelViewer from "./components/Avatar/ModelViewer";
  import "./App.css";
  import Landing from "./Landing";
import Help from "./components/Avatar/Help/help.jsx";
import FeedbackModal from "./components/Avatar/Feedback/FeedbackModal";
import { speak } from "./speak";
import HistoryPanel from "./components/HistoryPanel/HistoryPanel";




  function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
    // const [input, setInput] = useState("");
    const interviewEndRef = useRef(null);

    const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
    // const [messages, setMessages] = useState([]);
    const [chatMessages, setChatMessages] = useState([ {
      from: "ai",
      text: "Hello! I’m your AI Career Assistant. I can help you with career guidance, interview preparation, skill roadmaps, resume advice, and job-related doubts.\n\nAsk anything when you’re ready."
    }]);
const [chatInput, setChatInput] = useState("");
  const [avatarState, setAvatarState] = useState(AVATAR_STATES.IDLE);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user, logout } = useAuth();

  const [chatSessionId, setChatSessionId] = useState(0);

  const [awaitingAnswer, setAwaitingAnswer] = useState(false);


  const [interviewMessages, setInterviewMessages] = useState([]);
  const [interviewInput, setInterviewInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("chat"); 
    const [showInterviewSetup, setShowInterviewSetup] = useState(false);
    const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showReport, setShowReport] = useState(false);
const [reportData, setReportData] = useState(null);
  const [showViewHistory, setShowViewHistory] = useState(false);
  const [viewHistoryData, setViewHistoryData] = useState(null);
  const [search, setSearch] = useState("");
  const [entered, setEntered] = useState(false);
   const [screen, setScreen] = useState("landing");
  const [aiSpeaking, setAiSpeaking] = useState(false);


  useEffect(() => {
    interviewEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [interviewMessages, loading]);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);
  //speech recognition  useEffect


  // FILE UPLOAD HANDLER
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.text) {
        setUploadedDoc({
          name: data.filename,
          text: data.text
        });

        setChatMessages(prev => [
          ...prev,
          {
            from: "system",
            text: `📄 **${data.filename} uploaded successfully.**  
  You can now ask me to analyze it.`
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    }

    setUploading(false);
  };


  // landing | app
 // MIC TOGGLE   
const toggleMic = () => {
  if (!recognitionRef.current) return;

  if (listening) {
    setListening(false);
    recognitionRef.current.stop(); // 🛑 user explicitly stops
    setAvatarState(AVATAR_STATES.IDLE);
  } else {
    setListening(true);
    recognitionRef.current.start(); // 🎙️ user explicitly starts
  }
};


    
  





  const startStopwatch = () => {
    setSeconds(0);
    setTimerRunning(true);
  };

  const stopStopwatch = () => {
    setTimerRunning(false);
  };
const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

// Generate report from interview session
  const generateReport = () => {
    const userMessages = interviewMessages.filter(m => m.from === "user");
    const aiMessages = interviewMessages.filter(m => m.from === "ai");
    
    // Calculate performance score based on Q&A engagement
    const answerLengths = userMessages.map(m => m.text.length);
    const avgAnswerLength = answerLengths.length > 0 
      ? answerLengths.reduce((a, b) => a + b, 0) / answerLengths.length 
      : 0;
    
    // Calculate score out of 10 based on participation and answer quality
    let score = 0;
    if (aiMessages.length > 0) score += 2; // Base score for participation
    if (userMessages.length >= aiMessages.length * 0.7) score += 2; // Answered most questions
    if (avgAnswerLength > 50) score += 2; // Detailed answers
    if (avgAnswerLength > 100) score += 2; // Very detailed answers
    if (seconds > 60) score += 2; //Spent good time
    
    // Generate areas to improve based on score
    const areasToImprove = [];
    if (score < 6) areasToImprove.push("Try to answer more questions with more detail");
    if (avgAnswerLength < 50) areasToImprove.push("Provide more detailed answers with examples");
    if (userMessages.length < aiMessages.length * 0.7) areasToImprove.push("Attempt to answer all questions posed");
    if (seconds < 60) areasToImprove.push("Spend more time on each answer to show depth");
    if (areasToImprove.length === 0) areasToImprove.push("Great job! Keep practicing to maintain consistency");
    
    // Generate candidate qualities based on answer quality
    const qualities = [];
    if (avgAnswerLength > 30) qualities.push("Shows willingness to communicate");
    if (avgAnswerLength > 80) qualities.push("Provides detailed responses");
    if (userMessages.some(m => m.text.toLowerCase().includes("i") || m.text.toLowerCase().includes("my"))) {
      qualities.push("Uses personal examples to illustrate points");
    }
    if (userMessages.some(m => m.text.toLowerCase().includes("year") || m.text.toLowerCase().includes("experience"))) {
      qualities.push("References relevant experience");
    }
    if (userMessages.some(m => m.text.toLowerCase().includes("skill") || m.text.toLowerCase().includes("能力"))) {
      qualities.push("Highlights technical skills");
    }
    if (qualities.length === 0) qualities.push("Good participation in the interview");
    
    const report = {
      jobTitle: interviewConfig.jobTitle,
      experience: interviewConfig.experience,
      duration: formatTime(seconds),
      totalQuestions: aiMessages.length,
      totalAnswers: userMessages.length,
      performanceScore: score,
      areasToImprove,
      qualities,
      questions: aiMessages.map((m, i) => ({
        question: m.text.substring(0, 100) + (m.text.length > 100 ? "..." : ""),
        answer: userMessages[i]?.text?.substring(0, 100) + (userMessages[i]?.text?.length > 100 ? "..." : "")
      }))
    };
    
    setReportData(report);
    setShowReport(true);
    setShowExitConfirm(false);
  };


  const [interviewConfig, setInterviewConfig] = useState({
    jobTitle: "",
    experience: ""
  });
  // "chat" | "interview"



const startNewChat = () => {
    setMode("chat");
    setChatMessages([]);
    setChatInput("");
    setLoading(false);
    setChatSessionId((prev) => prev + 1);
  };

const handleSave = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    try {
      const messages = chatMessages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
        timestamp: new Date()
      }));

      const summary = chatMessages.length > 0 
        ? chatMessages[chatMessages.length - 1]?.text?.slice(0, 100) || "Chat session"
        : "Chat session";

      await axios.post("http://localhost:5000/api/history/save", {
        userId: user.uid,
        messages,
        summary
      });

      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  };

  const handleViewHistory = (item) => {
    setViewHistoryData(item);
    setShowViewHistory(true);
  };

  const handleDeleteHistory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/history/${id}`);
      setShowViewHistory(false);
      setViewHistoryData(null);
      // Refresh will happen automatically when component re-renders
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete history:", err);
    }
  };



  //   
 const sendMessage = async () => {
  // 🛑 HARD STOP MIC IMMEDIATELY
  if (recognitionRef.current) {
    recognitionRef.current.abort(); // stronger than stop
  }

  setListening(false);
  setAvatarState(AVATAR_STATES.IDLE);

  if (!user) {
    setAuthOpen(true);
    return;
  }

  if (loading) return;

  const currentInput =
    mode === "chat" ? chatInput : interviewInput;

  if (!currentInput.trim()) return;

  setLoading(true);
  setAvatarState(AVATAR_STATES.TALKING);

  const payload = {
    message: currentInput,
    mode,
    jobTitle: interviewConfig.jobTitle,
    experience: interviewConfig.experience,
    documentText:
      mode === "chat" && uploadedDoc ? uploadedDoc.text : null
  };

  const res = await fetch("http://localhost:5000/chat/public", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (mode === "chat") {
    setChatMessages((prev) => [
      ...prev,
      { from: "user", text: currentInput },
      { from: "ai", text: data.reply }
    ]);
    setChatInput("");
  } else {
    setInterviewMessages((prev) => [
      ...prev,
      { from: "user", text: currentInput },
      { from: "ai", text: data.reply }
    ]);

    // 🗣 AI speaks — mic MUST be locked
    setAiSpeaking(true);
    speak(data.reply, () => {
      setAiSpeaking(false);
      setAvatarState(AVATAR_STATES.IDLE);
    });

    setInterviewInput("");
  }

  setLoading(false);
};

  
 

 useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onstart = () => {
    if (aiSpeaking) {
      recognition.abort();
      return;
    }
    setListening(true);
    setAvatarState(AVATAR_STATES.LISTENING);
  };

  recognition.onend = () => {
    setListening(false);
    setAvatarState(AVATAR_STATES.IDLE);
  };

  recognition.onerror = () => {
    setListening(false);
    setAvatarState(AVATAR_STATES.IDLE);
  };

  recognition.onresult = (event) => {
    if (aiSpeaking) return; // 🚫 BLOCK AI FEEDBACK

    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + " ";
      }
    }

    if (!finalTranscript) return;

    if (mode === "chat") {
      setChatInput((prev) => prev + finalTranscript);
    } else {
      setInterviewInput((prev) => prev + finalTranscript);
    }
  };

  recognitionRef.current = recognition;

  return () => recognition.abort();
}, [mode, aiSpeaking]);



  //app notations:
    return (
    <>
  <video
    autoPlay
    loop
    muted
    playsInline
    className="bg-video"
  >
    <source src="/bgvideo.mp4" type="video/mp4" />
  </video>
  <div className="video-overlay"></div>
      {screen === "landing" && (
      <Landing onEnter={() => setScreen("app")} />
    )}

    {screen === "help" && (
      <Help onBack={() => setScreen("app")} />
    )}
   {screen === "app" && (
      <div className="app-container">
      
  <nav className="navbar">

    <div className="navbar-logo"  onClick={() => setScreen("landing")}>
      
    AI-Guide</div>
    
      
  

    <div className="navbar-right">
  <span className="navbar-item" onClick={() => setScreen("help")}
  >
    Help
  </span>
  <span className="navbar-item" onClick={() => setFeedbackOpen(true)}>Feedback</span>
      {user ? (
        <span className="navbar-itemdd" onClick={() => setProfileOpen(true)}>
          {user.displayName || user.email}
        </span>


      ) : (
        <button 
          className="navbar-login-btn"
          onClick={() => setAuthOpen(true)}
        >
          Login 
        </button>
      )}
    </div>

  </nav>

        <div className="layout">

        {/* HISTORY PANEL */}
        {mode === "chat" && (
        <div className="history-panel">
          <button
    className="new-chat-btn"
    onClick={() => startNewChat("chat")}
  >
    💬 AI Assistance | New 💬
  </button>
    <button
    className="interview-mode-btn"
  onClick={() => setShowInterviewSetup(true)}
  >
    🧾 Interview Mode
  </button>
          <div className="history-header"></div>


<HistoryPanel onViewHistory={handleViewHistory} />
    
            
          
          
          
        </div>
  )}


          {mode === "chat" && (
    <div className="chat-box">
     
    <div className="chat-header">  AI Guidance Desk <button 
        
onClick={() => handleSave()}
        disabled={isSaved}
        title={isSaved ? "Saved to history" : "Save to history"}
      >
        {isSaved ? "✅" : "💾"}
      </button> </div> 
  {uploadedDoc && (
    <div className="attached-doc-banner">
      <span>📄 {uploadedDoc.name}</span>
      <button onClick={() => setUploadedDoc(null)}>✖</button>
    </div>
  )}
      <div className="chat-messages">
      {chatMessages.map((m, i) => (
    <div className={`message ${m.from}`}>
    {m.from === "ai" ? (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {m.text}
      </ReactMarkdown>
    ) : (
      m.text
    )}
  </div>

  ))}


{loading && (
          <div className="message ai thinking">
            ...
          </div>
        )}
      </div>



    <div className="chat-input-wrapper">
      <label className="upload-btn">
    📎
    <input
      type="file"
      accept=".pdf,.docx,.txt"
      hidden
      onChange={handleFileUpload}
    />
  </label>
  <input 
    value={chatInput}
    onFocus={() => {
      if (!user) {
        setAuthOpen(true);
      }
    }}
    onChange={(e) => setChatInput(e.target.value)}
    placeholder={
      user ? "Ask the question..." : "Login to start chatting"
    }
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    }}
  />


    <button onClick={sendMessage} disabled={loading}>
      {loading ? "…" : "➤"}
    </button>
  </div>
    </div>
  )}




  {/* INterviewwwwwwwww */}


  {mode === "interview" && (
    <div className="interview-container">

      {/* HEADER */}
      <div className="interview-header">
    <div className="interview-title">
      {interviewConfig.jobTitle} Interview
    </div>

    <div className="interview-timer">
      ⏱ {formatTime(seconds)}
    </div>

    <button
      className="exit-interview-btn"
    onClick={() => setShowExitConfirm(true)}
  >
    Exit Interview
    </button>
    {/* <button
    className="end-interview-btn"
    onClick={endInterview}
  >
    End Interview
  </button> */}
  </div>

      {/* BODY */}
      <div className="interview-body">

        {/* AVATAR PANEL */}
        <div className="avatar-panel">
            <img
      src="interv.png"
      alt="Interviewer"
    
    />


          <div className="avatar-status">
    {avatarState === "listening" && "Listening"}
    {avatarState === "talking" && "Speaking"}
    {avatarState === "idle" && "Idle"}
  </div>

        </div>

        {/* INTERVIEW CHAT PANEL */}
        <div className="interview-chat-panel">

        <div className="interview-messages">
    {interviewMessages.map((m, i) => (
  <div className={`message ${m.from}`}>
    {m.from === "ai" ? (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {m.text}
      </ReactMarkdown>
    ) : (
      m.text
    )}
  </div>

  ))}

    {loading && (
      <div className="interview-message ai thinking">
        AI is thinking...
      </div>
    )}
      <div ref={interviewEndRef} />
  </div>

          <div className="interview-input-wrapper">
 <button
    className={`mic-btn ${listening ? "active" : ""}`}
    onClick={toggleMic}
    title="Voice typing"
  >
    🎤
  </button>

    <input
    value={interviewInput}
    onChange={(e) =>{ setInterviewInput(e.target.value);
      setAvatarState(AVATAR_STATES.LISTENING);
    }}
    placeholder="Answer the question..."
    disabled={loading}
    onKeyDown={(e) => {
      if (e.key === "Enter") sendMessage();
    }}
  />

    <button onClick={sendMessage} disabled={loading}>
      {loading ? "…" : "➤"}
    </button>
  </div>

        </div>
      </div>

    </div>
  )}
  {showExitConfirm && (
    <div className="modal-overlay">
      <div className="exit-confirm-modal">

        <h3>Exit Interview?</h3>
        <p>Your current interview progress will be lost.</p>

        <div className="exit-confirm-actions">
          <button
            className="cancel-btn"
            onClick={() => setShowExitConfirm(false)}
          >
            Cancel
          </button>

<button
            className="generate-report-btn"
            onClick={() => {
              stopStopwatch();
              window.speechSynthesis.cancel();
              generateReport();
            }}
          >
            Generate Report
          </button>
        </div>

      </div>
    </div>
)}
  {showReport && reportData && (
    <div className="modal-overlay">
      <div className="report-modal">
        <button
          className="modal-close-btn"
          onClick={() => {
            setShowReport(false);
            setMode("chat");
          }}
        >
          ✕
        </button>

        <h3>Interview Report</h3>
        
<div className="report-summary">
          <div className="report-item">
            <span className="report-label">Job Title:</span>
            <span className="report-value">{reportData.jobTitle}</span>
          </div>
          <div className="report-item">
            <span className="report-label">Experience:</span>
            <span className="report-value">{reportData.experience} years</span>
          </div>
          <div className="report-item">
            <span className="report-label">Duration:</span>
            <span className="report-value">{reportData.duration}</span>
          </div>
          <div className="report-item">
            <span className="report-label">Total Q&A:</span>
            <span className="report-value">{reportData.totalQuestions} questions, {reportData.totalAnswers} answers</span>
          </div>
        </div>

        <div className="performance-score">
          <span className="score-label">Performance Score:</span>
          <span className="score-value">{reportData.performanceScore}/10</span>
        </div>

        <div className="areas-section">
          <h4>Areas to Improve:</h4>
          <ul className="areas-list">
            {reportData.areasToImprove.map((area, i) => (
              <li key={i}>{area}</li>
            ))}
          </ul>
        </div>

        <div className="qualities-section">
          <h4>Candidate Qualities:</h4>
          <ul className="qualities-list">
            {reportData.qualities.map((quality, i) => (
              <li key={i}>{quality}</li>
            ))}
          </ul>
        </div>

        <div className="report-questions">
          <h4>Questions & Answers:</h4>
          {reportData.questions.slice(0, 5).map((q, i) => (
            <div key={i} className="qa-item">
              <p className="qa-question"><strong>Q{i+1}:</strong> {q.question}</p>
              {q.answer && <p className="qa-answer"><strong>A:</strong> {q.answer}</p>}
            </div>
          ))}
        </div>

        <button
          className="back-to-chat-btn"
          onClick={() => {
            setShowReport(false);
            setMode("chat");
          }}
        >
          Back to Chat
        </button>
      </div>
    </div>
  )}
  {showInterviewSetup && (
    <div className="modal-overlay">
      <div className="interview-modal">

        {/* CLOSE BUTTON */}
        <button
          className="modal-close-btn"
          onClick={() => setShowInterviewSetup(false)}
          aria-label="Close interview setup"
        >
          ✕
        </button>

        <h3>Interview Setup</h3>

        <input
          placeholder="Job Title (e.g.For Frontend Developer)"
          value={interviewConfig.jobTitle}
          onChange={(e) =>
            setInterviewConfig({
              ...interviewConfig,
              jobTitle: e.target.value
            })
          }
        />
        <input
          placeholder="Proffession? (e.g. Data Analyst)"/>

        <select
          value={interviewConfig.experience}
          onChange={(e) =>
            setInterviewConfig({
              ...interviewConfig,
              experience: e.target.value
            })
          }
        >
          <option value="">Select Experience</option>
          <option value="0-1">0–1 Years</option>
          <option value="2-3">2–3 Years</option>
          <option value="4-6">4–6 Years</option>
          <option value="7+">7+ Years</option>
        </select>

        <button
    className="start-interview-btn"
    onClick={() => {
      if (!interviewConfig.jobTitle || !interviewConfig.experience) return;

      setShowInterviewSetup(false);
      setMode("interview");

      // RESET INTERVIEW STATE
      setInterviewMessages([
        {
          from: "ai",
          text: "Introduce yourself."
        }
      ]);
speak("Introduce yourself.");
      setAwaitingAnswer(true);
      setInterviewInput("");
      startStopwatch();
    }}
  >
    Start Interview
  </button>

      </div>
    </div>
  )}
{authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
  {showViewHistory && viewHistoryData && (
    <div className="modal-overlay">
      <div className="view-history-modal">
        <button
          className="modal-close-btn"
          onClick={() => {
            setShowViewHistory(false);
            setViewHistoryData(null);
          }}
        >
          ✕
        </button>

        <h3>Chat History</h3>
        
        <div className="view-history-messages">
          {viewHistoryData.messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-label">
                {msg.role === "user" ? "You" : "AI"}
              </div>
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <button
          className="delete-history-btn"
          onClick={() => handleDeleteHistory(viewHistoryData._id)}
        >
          Delete Chat
        </button>
      </div>
    </div>
  )}
  {feedbackOpen && <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} user={user} />}
  {profileOpen && (
    <div className="modal-overlay">
      <div className="profile-modal">
        <button
          className="modal-close-btn"
          onClick={() => setProfileOpen(false)}
          aria-label="Close profile"
        >
          ✕
        </button>
        <h3>Profile</h3>
        <div className="profile-info">
          <div className="profile-field">
            <label>Name:</label>
            <span>{user.displayName || 'N/A'}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            logout();
            setProfileOpen(false);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )}


      </div>
      </div>
   )}
      </>
    );
  }
  export default App;
