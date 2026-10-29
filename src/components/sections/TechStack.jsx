import { useEffect, useState } from "react";
import {
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiJavascript,
  SiExpress,
  SiTailwindcss,
} from "react-icons/si";
import { Code2 } from "lucide-react";
import RadialGradientBackground from "../backgrounds/RadialGradientBackground";
import ScrollReveal from "../animations/ScrollReveal";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const fallbackItems = [
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
];

const icons = {
  javascript: SiJavascript,
  react: SiReact,
  "node.js": SiNodedotjs,
  node: SiNodedotjs,
  express: SiExpress,
  "express.js": SiExpress,
  mongodb: SiMongodb,
  "tailwind css": SiTailwindcss,
};

function parseSkills(value) {
  if (Array.isArray(value))
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function TechStack() {
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`);
        if (!response.ok) return;

        const result = await response.json();
        const skills = parseSkills(result?.data?.skills?.technical);

        if (!cancelled && result.success && skills.length) {
          setItems(skills.slice(0, 6));
        }
      } catch (error) {
        console.error("Unable to load tech stack:", error);
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-white/5 py-16 sm:py-20">
      <RadialGradientBackground className="opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Technologies
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Tools I have used while building and learning
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((label) => {
            const Icon = icons[label.toLowerCase()] || Code2;

            return (
              <div
                key={label}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center transition hover:border-accent/30"
              >
                <Icon className="h-9 w-9 text-accent" />
                <p className="mt-3 text-sm font-medium text-white">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
