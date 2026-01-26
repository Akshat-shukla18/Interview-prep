export function speak(text, onEnd) {
  if (!window.speechSynthesis) return;

  // 🔇 Stop any ongoing speech immediately
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.lang = "en-US";

  const assignVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();

    const preferred =
      voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ||
      voices.find(v => v.lang === "en-US");

    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  };

  // 🟢 When AI starts speaking
  utterance.onstart = () => {
    // optional hook if needed later
  };

  // 🟢 When AI finishes speaking
  utterance.onend = () => {
    onEnd?.(); // 🔥 THIS IS THE IMPORTANT PART
  };

  // 🛡 Handle browser voice loading race
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = assignVoiceAndSpeak;
  } else {
    assignVoiceAndSpeak();
  }
}
