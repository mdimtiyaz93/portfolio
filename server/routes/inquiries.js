import express from "express";
import Inquiry from "../models/Inquiry.js";
import { verifyAdmin } from "../middleware/auth.js";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

function getAutoReply(name, message) {
  const text = message.toLowerCase();

  if (/\b(internship|job|career|hiring|recruitment)\b/.test(text)) {
    return `Hi ${name},

Thank you for reaching out regarding career opportunities! I've received your message and will review it. I'll get back to you if there's a suitable opportunity or if I need more information.

Best regards,
Md Imtiyaz`;
  }

  if (
    /\b(project|collaboration|collaborate|work together|partnership)\b/.test(
      text,
    )
  ) {
    return `Hi ${name},

Thank you for your interest in collaborating! I've received your message and will review your idea. I'll get back to you soon.

Best regards,
Md Imtiyaz`;
  }

  return `Hi ${name},

Thank you for contacting me through my portfolio! I've received your message and will get back to you as soon as possible.

Best regards,
Md Imtiyaz`;
}

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    if (
      !cleanName ||
      cleanName.length > 20 ||
      !cleanMessage ||
      cleanMessage.length > 250 ||
      !cleanEmail ||
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid contact details.",
      });
    }

    const inquiry = await Inquiry.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    if (process.env.RESEND_API_KEY) {
      try {
        if (!process.env.NOTIFICATION_EMAIL) {
          throw new Error("NOTIFICATION_EMAIL is missing.");
        }

        const { error } = await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [process.env.NOTIFICATION_EMAIL],
          subject: `New portfolio message from ${cleanName}`,
          text: [
            `Name: ${cleanName}`,
            `Email: ${cleanEmail}`,
            "",
            "Message:",
            cleanMessage,
          ].join("\n"),
          replyTo: cleanEmail,
        });

        if (error) throw new Error(error.message);
      } catch (error) {
        console.error("Notification email failed:", error.message);
      }

      try {
        const { error } = await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [cleanEmail],
          subject: "Thanks for contacting me!",
          text: getAutoReply(cleanName, cleanMessage),
        });

        if (error) throw new Error(error.message);
      } catch (error) {
        console.error("Auto-reply email failed:", error.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been received successfully.",
      data: { id: inquiry._id },
    });
  } catch (error) {
    console.error("Submit inquiry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now.",
    });
  }
});

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();

    return res.json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Fetch inquiries error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries.",
    });
  }
});

router.patch("/:id/read", verifyAdmin, async (req, res) => {
  try {
    if (typeof req.body.isRead !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isRead must be true or false.",
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: req.body.isRead } },
      { new: true, runValidators: true },
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.json({ success: true, data: inquiry });
  } catch (error) {
    const invalidId = error.name === "CastError";

    return res.status(invalidId ? 400 : 500).json({
      success: false,
      message: invalidId ? "Invalid inquiry ID." : "Failed to update inquiry.",
    });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    const invalidId = error.name === "CastError";

    return res.status(invalidId ? 400 : 500).json({
      success: false,
      message: invalidId ? "Invalid inquiry ID." : "Failed to delete inquiry.",
    });
  }
});

export default router;
