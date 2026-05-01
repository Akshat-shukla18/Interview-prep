import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./HistoryPanel.css";

function HistoryPanel({ onSelectHistory, onViewHistory }) {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/history?userId=${user.uid}`
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

const toggleExpand = (id) => {
    // Only open popup when expanding (not when collapsing)
    if (expandedId !== id) {
      const item = history.find(h => h._id === id);
      if (item && onViewHistory) {
        onViewHistory(item);
      }
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelectHistory = (item) => {
    if (onSelectHistory) {
      onSelectHistory(item.messages);
    }
  };

const handleViewHistory = (item) => {
    if (onViewHistory) {
      onViewHistory(item);
    }
  };

  return (
    <div className="history-panel-container">
      <div className="history-panel-header">
        <h3>Chat History</h3>
        <span className="history-count">{history.length} sessions</span>
      </div>

      {loading ? (
        <div className="history-loading">Loading...</div>
      ) : history.length === 0 ? (
        <div className="history-empty">
          No saved chats yet.
          <br />
          Start a conversation and save it!
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div
              key={item._id}
              className={`history-card ${expandedId === item._id ? "expanded" : ""}`}
            >
              <div
                className="history-card-header"
                onClick={() => toggleExpand(item._id)}
              >
                <div className="history-summary">{item.summary}</div>
                <div className="history-meta">
                  <span className="history-date">
                    {formatDate(item.createdAt)}
                  </span>
                  <span className="history-toggle">
                    {expandedId === item._id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

{expandedId === item._id && (
                <div className="history-messages">
                  {item.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`history-message ${msg.role}`}
                    >
                      <div className="history-message-label">
                        {msg.role === "user" ? "You" : "AI"}
                      </div>
                      <div className="history-message-content">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div className="history-actions">
                    <button
                      className="history-view-btn"
                      onClick={() => handleViewHistory(item)}
                    >
                      View Full
                    </button>
                    <button
                      className="history-load-btn"
                      onClick={() => handleSelectHistory(item)}
                    >
                      Load
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
