import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Wrench } from "lucide-react";

import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import Hero from "./components/sections/Hero";
import ProjectsSection from "./components/sections/ProjectsSection";
import SkillsSection from "./components/sections/SkillsSection";
import TechStack from "./components/sections/TechStack";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
          <Wrench size={36} className="text-emerald-400" />
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Under Maintenance
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          We'll be back soon.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
          The website is temporarily unavailable while we make some
          improvements. Please check back soon. Thank you for your patience.
        </p>

        <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-emerald-400" />
      </div>
    </div>
  );
}

function Portfolio() {
  const [maintenance, setMaintenance] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkMaintenance() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Unable to check maintenance status");
        }

        const setting = result.data?.settings?.maintenance;

        if (!cancelled) {
          setMaintenance(setting === true || setting === "true");
        }
      } catch (error) {
        console.error("Maintenance status check failed:", error);
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    checkMaintenance();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return <div className="min-h-screen bg-black" />;
  }

  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <TechStack />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}
