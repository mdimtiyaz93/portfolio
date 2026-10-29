import express from "express";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();

const publicSections = [
  "hero",
  "about",
  "skills",
  "projects",
  "contact",
  "stats",
  "settings",
];

router.get("/", async (req, res) => {
  try {
    const sections = await Portfolio.find(
      { section: { $in: publicSections } },
      { _id: 0, section: 1, content: 1 },
    ).lean();

    const data = {};

    for (const item of sections) {
      data[item.section] = item.content;
    }

    res.set("Cache-Control", "no-store");

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Public portfolio fetch failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio data",
    });
  }
});

export default router;
