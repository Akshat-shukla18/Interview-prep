import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (mode === "signup") {
      if (!name.trim()) return setError("Name is required");
      if (password.length < 6)
        return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(res.user, { displayName: name });
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <button className="modal-close" onClick={onClose}>✖</button>

        <h3>{mode === "login" ? "Login" : "Sign Up"}</h3>

        {mode === "signup" && (
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        <p className="auth-switch">
          {mode === "login" ? "No account?" : "Already have an account?"}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? " Sign up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
