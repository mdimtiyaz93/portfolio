import { useEffect, useState } from "react";
import { Database, Globe, Server, Braces } from "lucide-react";
import ScrollReveal from "../animations/ScrollReveal";
import RadialGradientBackground from "../backgrounds/RadialGradientBackground";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const defaultGroups = [
  {
    title: "Languages",
    Icon: Braces,
    number: "01",
    items: ["JavaScript", "Java", "Python", "SQL"],
  },
  {
    title: "Frontend",
    Icon: Globe,
    number: "02",
    items: ["HTML", "CSS", "React", "Tailwind CSS", "EJS"],
  },
  {
    title: "Backend & APIs",
    Icon: Server,
    number: "03",
    items: ["Node.js", "Express.js", "REST APIs", "Socket.IO"],
  },
  {
    title: "Database & Tools",
    Icon: Database,
    number: "04",
    items: ["MongoDB", "Git", "GitHub", "Postman"],
  },
];

function parseSkills(value) {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function categorizeSkills(technical, tools) {
  const groups = defaultGroups.map((group) => ({
    ...group,
    items: [],
  }));

  const rules = [
    (skill) =>
      /^(java(script)?|python|sql|c\+\+|c#|c|typescript)$/i.test(skill),
    (skill) =>
      /^(html|css|react(\.js)?|tailwind(\s*css)?|bootstrap|ejs|next\.js)$/i.test(
        skill,
      ),
    (skill) =>
      /^(node(\.js)?|express(\.js)?|rest apis?|socket\.io|websocket|webRTC)$/i.test(
        skill,
      ),
    (skill) =>
      /^(mongodb|mysql|postgresql|sql server|git|github|postman|cloudinary|mongoose)$/i.test(
        skill,
      ),
  ];

  const seen = new Set();

  [...technical, ...tools].forEach((skill) => {
    const key = skill.toLowerCase();

    if (seen.has(key)) return;
    seen.add(key);

    const index = rules.findIndex((rule) => rule(skill));

    if (index >= 0) {
      groups[index].items.push(skill);
    } else {
      groups[0].items.push(skill);
    }
  });

  return groups;
}

export default function SkillsSection() {
  const [groups, setGroups] = useState(defaultGroups);

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`);
        if (!response.ok) return;

        const result = await response.json();
        const skills = result?.data?.skills;

        if (!cancelled && result.success && skills) {
          setGroups(
            categorizeSkills(
              parseSkills(skills.technical),
              parseSkills(skills.tools),
            ),
          );
        }
      } catch (error) {
        console.error("Unable to load skills:", error);
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-b border-white/5 bg-black theme-bg theme-border py-20 sm:py-28"
    >
      <RadialGradientBackground className="opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Skills & Technologies
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Tools I&apos;m Learning & Using
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
              A practical toolkit built through coursework, coding practice, and
              hands-on projects.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ title, Icon, items, number }, index) => (
            <ScrollReveal key={title} delayMs={index * 70}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] theme-card theme-border p-6 transition-all duration-300 hover:-translate-y-2 hover:border-accent/50 hover:shadow-xl hover:shadow-green-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>

                  <span className="text-xs font-semibold tracking-widest text-zinc-500">
                    {number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-white transition-colors group-hover:text-accent">
                  {title}
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-300 theme-card theme-border transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 h-1 w-10 rounded-full bg-accent/50 transition-all duration-300 group-hover:w-full group-hover:bg-accent" />
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delayMs={200}>
          <p className="mt-10 text-center text-sm leading-relaxed text-zinc-400">
            Always learning. Always building. Focused on improving one skill at
            a time.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
