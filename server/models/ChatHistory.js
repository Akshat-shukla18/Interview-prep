import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    index: true
  },
  mode: {
    type: String,
    default: "chat",
    enum: ["chat"]
  },
  summary: {
    type: String,
    required: true
  },
  messages: [
    {
      role: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  isFullSave: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
export default ChatHistory;
