import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, TXT allowed.'), false);
    }
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, mimetype, originalname } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      const uint8Array = new Uint8Array(buffer); 
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array
      });
      const pdf = await loadingTask.promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        extractedText += strings.join(" ") + "\n";
      }
    }

    else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    else if (mimetype === "text/plain") {
      extractedText = buffer.toString("utf-8");
    }

    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    extractedText = extractedText.slice(0, 6000);

    res.json({
      filename: originalname,
      text: extractedText
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "File processing failed" });
  }
});

export default router;
