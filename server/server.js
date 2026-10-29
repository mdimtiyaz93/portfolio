import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";
import adminRoutes from "./routes/admin.js";
import portfolioRoutes from "./routes/portfolio.js";
import inquiryRoutes from "./routes/inquiries.js";
import { verifyAdmin } from "./middleware/auth.js";
import publicPortfolioRoutes from "./routes/publicPortfolio.js";
import resumeRoutes from "./routes/resume.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Portfolio Admin API is running",
  });
});

app.get("/api/health", async (req, res) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  let databaseVerified = false;

  if (mongoConnected) {
    try {
      await mongoose.connection.db.admin().ping();
      databaseVerified = true;
    } catch (error) {
      console.error("MongoDB health check failed:", error.message);
    }
  }

  const healthy = mongoConnected && databaseVerified;

  return res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? "healthy" : "degraded",
    services: {
      server: "connected",
      mongodb: databaseVerified ? "connected" : "disconnected",
    },
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/admin/resume", resumeRoutes);
app.use("/api/admin/portfolio", portfolioRoutes);
app.use("/api/portfolio", publicPortfolioRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.get("/api/admin/dashboard", verifyAdmin, (req, res) => {
  return res.json({
    success: true,
    message: "Welcome to the Admin Dashboard",
  });
});

async function createInitialAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address");
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  const existingAdmin = await Admin.findOne({});
  const hashedPassword = await bcrypt.hash(password, 12);

  if (existingAdmin) {
    existingAdmin.email = email;
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();

    console.log("Admin credentials updated successfully");
  } else {
    await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log("Initial admin created successfully");
  }
}

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    await createInitialAdmin();

    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
