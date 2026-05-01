import express from "express";
import ChatHistory from "../models/ChatHistory.js";

const router = express.Router();

// GET all chat history for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const history = await ChatHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("summary messages createdAt");

    res.json(history);
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { userId, messages, summary } = req.body;

    if (!userId || !messages || !summary) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const chatHistory = new ChatHistory({
      userId,
      mode: "chat",
      summary,
      messages,
      isFullSave: true
    });

    await chatHistory.save();

    res.json({ success: true, message: "Chat history saved" });
  } catch (err) {
    console.error("Save history error:", err);
    res.status(500).json({ error: "Failed to save chat history" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await ChatHistory.findByIdAndDelete(id);
    
    res.json({ success: true, message: "History deleted" });
  } catch (err) {
    console.error("Delete history error:", err);
    res.status(500).json({ error: "Failed to delete history" });
  }
});

export default router;
