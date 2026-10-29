import express from "express";
import Portfolio from "../models/Portfolio.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

const allowedSections = [
  "hero",
  "about",
  "skills",
  "projects",
  "contact",
  "stats",
  "settings",
];

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const sections = await Portfolio.find();

    return res.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("Fetch portfolio data failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio data",
    });
  }
});

router.put("/:section", verifyAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: "Invalid section",
      });
    }

    if (content === undefined) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const savedSection = await Portfolio.findOneAndUpdate(
      { section },
      { $set: { content } },
      { new: true, upsert: true, runValidators: true },
    );

    return res.json({
      success: true,
      message: "Section saved successfully",
      data: savedSection,
    });
  } catch (error) {
    console.error("Save portfolio data failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save portfolio data",
    });
  }
});

export default router;
