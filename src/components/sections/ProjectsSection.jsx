import { useEffect, useState } from "react";
import { ExternalLink, Briefcase } from "lucide-react";
import { SiGithub } from "react-icons/si";
import ScrollReveal from "../animations/ScrollReveal";
import RadialGradientBackground from "../backgrounds/RadialGradientBackground";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const fallbackProjects = [
  {
    title: "Wanderlust",
    type: "Full-Stack Travel Listing App",
    description:
      "An Airbnb-style listing platform featuring user authentication, listing management, image uploads, and map-based location display.",
    stack: ["Node.js", "Express", "MongoDB", "EJS", "Cloudinary"],
    demo: "https://wanderlust-hfhq.onrender.com/",
    github: "https://github.com/mdimtiyaz93",
    accent: "WL",
  },
  {
    title: "Apna Video Call",
    type: "Real-Time Communication",
    description:
      "A video calling application exploring WebRTC peer-to-peer communication and Socket.IO signaling, with a React frontend and Node.js backend.",
    stack: ["React", "Node.js", "Socket.IO", "WebRTC", "MongoDB"],
    demo: "https://apna-video-call-xw3s.onrender.com",
    github: "https://github.com/mdimtiyaz93/Apna-video-call",
    accent: "AV",
  },
  {
    title: "WatchUp",
    type: "YouTube Watch Party",
    description:
      "A watch-party application featuring host and participant roles, synchronized playback actions, and real-time room communication.",
    stack: ["React", "Vite", "Socket.IO", "Clerk", "MongoDB"],
    demo: "",
    github: "https://github.com/mdimtiyaz93/WatchUp",
    accent: "WU",
  },
];

function normalizeProjects(value) {
  const entries = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.values(value)
      : [];

  return entries
    .filter((project) => project && typeof project === "object")
    .map((project, index) => ({
      title: project.title || `Project ${index + 1}`,
      type: project.type || "Development Project",
      description: project.description || "",
      stack: Array.isArray(project.stack)
        ? project.stack
        : typeof project.technologies === "string"
          ? project.technologies
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : Array.isArray(project.technologies)
            ? project.technologies
            : [],
      demo: project.demo || project.live || project.liveUrl || "",
      github: project.github || project.code || project.githubUrl || "",
      accent:
        project.accent ||
        (project.title || `P${index + 1}`)
          .split(/\s+/)
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
    }));
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`);

        if (!response.ok) {
          throw new Error("Failed to fetch portfolio");
        }

        const result = await response.json();
        const savedProjects = result?.data?.projects;

        if (!cancelled && result.success && savedProjects) {
          setProjects(normalizeProjects(savedProjects));
        }
      } catch (error) {
        console.error("Unable to load portfolio projects:", error);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-b border-white/5 bg-black theme-bg theme-border py-20 sm:py-28"
    >
      <RadialGradientBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
              <Briefcase className="h-4 w-4" />
              Selected Work
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Projects I&apos;ve Built
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
              A few hands-on projects where I&apos;ve practised full-stack
              development, database integration, and real-time features.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ScrollReveal
              key={`${project.title}-${index}`}
              delayMs={index * 100}
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] theme-card theme-border p-6 transition-all duration-300 hover:-translate-y-2 hover:border-accent/50 hover:shadow-xl hover:shadow-green-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-lg font-bold text-accent transition-transform duration-300 group-hover:scale-105">
                    {project.accent}
                  </div>

                  <span className="text-sm font-semibold tracking-widest text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-accent">
                  {project.type}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white transition-colors group-hover:text-accent">
                  {project.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 theme-border"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5 theme-border">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-85"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white theme-border transition hover:border-accent/60 hover:text-accent"
                    >
                      <SiGithub className="h-4 w-4" />
                      View Code
                    </a>
                  )}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Built with curiosity, consistency, and a focus on learning by doing.
        </p>
      </div>
    </section>
  );
}
