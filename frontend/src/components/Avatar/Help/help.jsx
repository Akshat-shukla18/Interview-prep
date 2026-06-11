import "./help.css";

export default function Help({ onBack }) {
  return (
    <div className="help-container">

    
     
      <div className="help-header">
        <button className="help-back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Welcome to Interview AI</h1>
        <p>
          Your intelligent assistant for career guidance, interview preparation,
          and resume analysis.
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="help-cards">
        <div className="help-card">
          <h3>💬 AI Assistance Mode</h3>
          <p>
            Ask career-related questions, get learning roadmaps, resume advice,
            or skill recommendations. You can also upload documents like resumes
            or PDFs for analysis.
          </p>
        </div>

        <div className="help-card">
          <h3>🧾 Interview Mode</h3>
          <p>
            Experience a realistic interview simulation. The AI asks questions
            based on your job role and experience level, evaluates your answers,
            and provides feedback.
          </p>
        </div>

        <div className="help-card">
          <h3>📄 Resume & Document Analysis</h3>
          <p>
            Upload resumes or documents to receive ATS insights, improvement
            suggestions, and role-specific feedback.
          </p>
        </div>

        <div className="help-card">
          <h3>🔐 Secure Login</h3>
          <p>
            Sign up using Email or Google to save your chats, upload files, and
            access personalized interview sessions securely.
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="help-contact">
        <h2>Contact the Developers</h2>
        <p>
          Facing issues or have feature suggestions? Reach out to us anytime.
        </p>

        <div className="contact-box">
          <span>📧 Email</span>
          <a href="mailto:akweb2025@gmail.com">
            akweb2025@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
