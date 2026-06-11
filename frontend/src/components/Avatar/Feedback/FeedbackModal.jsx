import { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, user }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async () => {
    if (!rating || !description.trim()) {
      alert('Please provide a rating and description.');
      return;
    }

    setLoading(true);

    const feedbackData = {
      name: user?.displayName || 'Anonymous',
      email: user?.email || 'No email',
      rating,
      description
    };

    try {
      const response = await fetch('http://localhost:5000/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        alert('Feedback sent successfully!');
        setRating(0);
        setDescription('');
        onClose();
      } else {
        alert('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Error sending feedback. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <button className="feedback-close-btn" onClick={onClose}>×</button>
        <h2>Feedback</h2>
        <div className="feedback-rating">
          <label>Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'selected' : ''}`}
                onClick={() => handleStarClick(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="feedback-description">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us your feedback..."
            rows="4"
          />
        </div>
        <button className="feedback-send-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending...' : 'Send Feedback'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
