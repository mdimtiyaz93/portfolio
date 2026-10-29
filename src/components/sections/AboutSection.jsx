import { useEffect, useState } from "react";
import { Code2, GraduationCap, Target } from "lucide-react";
import ScrollReveal from "../animations/ScrollReveal";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const defaultAbout = {
  heading: "Learning, building, improving.",
  description:
    "I'm pursuing a B.Tech in Computer Science Engineering at Ambalika Institute of Management and Technology, Lucknow. I enjoy building web applications, exploring backend development, and learning core computer science concepts. My goal is to grow into a strong software developer by combining hands-on projects with consistent problem-solving practice.",
  experience: "",
  projectsCompleted: "",
};

const defaultCards = [
  {
    Icon: GraduationCap,
    title: "Education",
    text: "B.Tech CSE · AIMT, Lucknow",
  },
  {
    Icon: Code2,
    title: "Development",
    text: "MERN stack projects and REST APIs",
  },
  {
    Icon: Target,
    title: "Current Focus",
    text: "Java, DSA, and stronger fundamentals",
  },
];

export default function AboutSection() {
  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    let cancelled = false;

    async function loadAbout() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`);

        if (!response.ok) return;

        const result = await response.json();

        if (!cancelled && result.success && result.data?.about) {
          setAbout((previous) => ({
            ...previous,
            ...result.data.about,
          }));
        }
      } catch (error) {
        console.error("Unable to load About section:", error);
      }
    }

    loadAbout();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-b border-white/5 bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">
              {about.heading || defaultAbout.heading}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <p className="mx-auto mt-7 max-w-3xl whitespace-pre-line text-center text-base leading-8 text-zinc-400">
            {about.description || defaultAbout.description}
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {defaultCards.map(({ Icon, title, text }) => (
            <ScrollReveal key={title}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-7 w-7 text-accent" />

                <h3 className="mt-4 font-semibold text-white">{title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
