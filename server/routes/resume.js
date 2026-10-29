import express from "express";
import multer from "multer";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import Portfolio from "../models/Portfolio.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF files are allowed"));
    }

    callback(null, true);
  },
});

router.post("/", verifyAdmin, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF file",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "portfolio/resumes",
          public_id: "resume.pdf",
          overwrite: true,
          invalidate: true,
        },
        (error, uploadedFile) => {
          if (error) {
            return reject(error);
          }

          resolve(uploadedFile);
        },
      );

      Readable.from(req.file.buffer).pipe(stream);
    });

    const hero = await Portfolio.findOne({ section: "hero" });

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    hero.content = {
      ...hero.content,
      resumeUrl: result.secure_url,
    };

    await hero.save();

    return res.json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Resume upload failed:", error);

    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
    });
  }
});

export default router;
