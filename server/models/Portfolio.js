import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "hero",
        "about",
        "skills",
        "projects",
        "contact",
        "stats",
        "settings",
      ],
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Portfolio", portfolioSchema);
