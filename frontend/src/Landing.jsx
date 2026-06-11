import "./landing.css";
import CardSwap, { Card } from "./components/Avatar/CardSwap/CardSwap.jsx";
import TextType from "./TextType";
import img1 from "./assets/guidance.png";
import img2 from "./assets/analysis.png";
import img3 from "./assets/concepts.png";
import img4 from "./assets/interview.png";

const startExperience = () => {
  const audio = new Audio("/welcome.mp3");
  audio.play();
};

export default function Landing({ onEnter }) {
  return (
    <div className="landing-root">
      {/* //mp3 */}
   <div className="content"></div>
   

      {/* FIXED HEADING (independent layer) */}
      <div className="landing-heading">
        <TextType
          text={[
            "AI Interview Coach",
            "Your AI Career Partner",
            "Crack Interviews Smarter",
          "Perform Better with Us.",
          "Careers, Guided by AI"
          ]}
          typingSpeed={75}
          pauseDuration={2000}
          showCursor={true}
          cursorCharacter="|"
        />
      </div>
      {/* main grid */}

      {/* MAIN CONTENT GRID */}
      <div className="landing-content">
        <div className="landing-left">
          <p>Your dedicated AI assistant for interview preparation, and placement guidance, Prepare Confidently for Interviews</p>

          <div className="button-wrapper">
            <button className="enter-btn" onClick={() => {
    onEnter();
    startExperience();
  }}>
              Get Started
            </button>
          </div>
        </div>

        <div className="landing-right">
          <div className="cards-wrapper">
            <CardSwap width={360} height={240}>
              <Card img={img1} />
              <Card img={img2} />
              <Card img={img3} />
              <Card img={img4} />
            </CardSwap>
          </div>
        </div>
      </div>

    </div>
  );
}
