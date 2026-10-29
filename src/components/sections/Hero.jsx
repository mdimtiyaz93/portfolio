import { useEffect, useState } from "react";
import { ChevronDown, Mail, Star } from "lucide-react";
import { SiMongodb, SiNodedotjs, SiReact, SiJavascript } from "react-icons/si";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ScrollReveal from "../animations/ScrollReveal";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const defaultHero = {
  name: "Md Imtiyaz",
  role: "Aspiring Software Developer",
  tagline:
    "I build full-stack web applications using JavaScript, React, Node.js, Express, and MongoDB. I'm currently strengthening my Java and problem-solving skills while building useful projects.",
  resumeUrl: "/md_imtiyaz_resume.pdf",
};

export default function Hero() {
  const [hero, setHero] = useState(defaultHero);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHero() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const result = await response.json();

        if (result.success && result.data?.hero) {
          setHero((previous) => ({
            ...previous,
            ...result.data.hero,
          }));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Unable to load hero content:", error);
        }
      }
    }

    loadHero();

    return () => controller.abort();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

  return (
    <section
      id="about"
      className="relative overflow-hidden border-b border-white/5 bg-black theme-bg theme-border"
    >
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-[520px] w-[440px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, #1a4d1a 0%, #0d2e0d 60%, transparent 100%)",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28">
        <div>
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
              <Star className="h-4 w-4" />
              Computer Science Engineering Student
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={100}>
            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hi, I'm <span className="text-accent">{hero.name}</span>
              <br />
              {hero.role}
            </h1>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {hero.tagline}
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={300}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo("projects")}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Explore Projects
              </button>

              <a
                href={hero.resumeUrl || "/Md_Imtiyaz_Resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="rounded-xl border border-white/15 theme-border px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/60 hover:text-accent"
              >
                Download Resume
              </a>
            </div>
          </ScrollReveal>

          <div className="mt-8 flex gap-4 text-zinc-400">
            <a
              aria-label="GitHub"
              href="https://github.com/mdimtiyaz93"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 theme-border p-3 transition hover:border-accent hover:text-accent"
            >
              <FaGithub className="h-5 w-5" />
            </a>

            <a
              aria-label="LinkedIn"
              href="https://www.linkedin.com/in/md-imtiyaz-765981372"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 theme-border p-3 transition hover:border-accent hover:text-accent"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>

            <button
              type="button"
              aria-label="Contact"
              onClick={() => scrollTo("contact")}
              className="rounded-lg border border-white/10 theme-border p-3 transition hover:border-accent hover:text-accent"
            >
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ScrollReveal delayMs={200} y={24}>
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] theme-card theme-border p-6 shadow-2xl sm:p-8">
            <div className="flex items-center gap-3 border-b border-white/10 theme-border pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <SiReact className="h-7 w-7" />
              </div>

              <div>
                <p className="font-semibold text-white">Developer Toolkit</p>
                <p className="text-sm text-zinc-500">Learning by building</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                {
                  Icon: SiJavascript,
                  name: "JavaScript",
                  note: "Frontend fundamentals",
                },
                {
                  Icon: SiNodedotjs,
                  name: "Node.js & Express",
                  note: "Backend and REST APIs",
                },
                {
                  Icon: SiMongodb,
                  name: "MongoDB",
                  note: "Database",
                },
              ].map(({ Icon, name, note }) => (
                <div
                  key={name}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-black/40 theme-card theme-border p-4"
                >
                  <Icon className="h-7 w-7 shrink-0 text-accent" />

                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-sm text-zinc-500">{note}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-zinc-400">
              Focused on writing better code, understanding fundamentals, and
              improving one project at a time.
            </p>
          </div>
        </ScrollReveal>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            type="button"
            onClick={() => scrollTo("skills")}
            aria-label="Scroll to skills"
            className="text-accent"
          >
            <ChevronDown className="h-7 w-7 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
