import { useEffect, useState } from "react";
import { Code2, Heart, ArrowUpRight, Mail } from "lucide-react";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import ScrollReveal from "../animations/ScrollReveal";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const DEFAULT_CONTACT = {
  email: "",
  github: "https://github.com/mdimtiyaz93",
  linkedin: "https://www.linkedin.com/in/md-imtiyaz-765981372",
  instagram: "https://www.instagram.com/md_imtiyaz93/",
  x: "https://x.com/imtiyaz9341",
};

const quickLinks = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Contact", "contact"],
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function Footer() {
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`);
        const result = await response.json();

        if (response.ok && result.success && result.data?.contact) {
          setContact({
            ...DEFAULT_CONTACT,
            ...result.data.contact,
          });
        }
      } catch (error) {
        console.error("Failed to load footer contact details:", error);
      }
    }

    loadContact();
  }, []);

  const socialLinks = [
    { Icon: SiGithub, href: contact.github, label: "GitHub" },
    { Icon: FaLinkedin, href: contact.linkedin, label: "LinkedIn" },
    { Icon: FaXTwitter, href: contact.x, label: "X" },
    { Icon: FaInstagram, href: contact.instagram, label: "Instagram" },
  ].filter(({ href }) => Boolean(href));

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black theme-bg theme-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-emerald-500/[0.08] blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          <ScrollReveal delayMs={0} y={24}>
            <div>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("about");
                }}
                className="group inline-flex items-center gap-3"
                aria-label="Go to About section"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 transition duration-300 group-hover:scale-105 group-hover:border-emerald-400/40">
                  <Code2 size={24} strokeWidth={2} />
                </span>

                <span className="text-2xl font-bold tracking-tight text-white theme-text">
                  Imtiyaz<span className="text-emerald-400">.</span>
                </span>
              </a>

              <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400 theme-muted">
                Computer Science Engineering student passionate about building
                web applications, exploring new technologies, and improving
                problem-solving skills.
              </p>

              <a
                href={contact.github || "#"}
                target={contact.github ? "_blank" : undefined}
                rel={contact.github ? "noopener noreferrer" : undefined}
                className="group mt-6 inline-flex max-w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 theme-card theme-border"
              >
                <SiGithub className="h-5 w-5 shrink-0 text-emerald-400" />

                <span className="min-w-0">
                  <span className="block text-xs text-zinc-500 theme-muted">
                    Check out my work
                  </span>
                  <span className="block break-all text-sm font-medium text-white theme-text">
                    {contact.github?.replace(/^https?:\/\//, "")}
                  </span>
                </span>

                <ArrowUpRight
                  size={17}
                  className="ml-1 shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400"
                />
              </a>

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="group mt-3 inline-flex max-w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 theme-card theme-border"
                >
                  <Mail className="h-5 w-5 shrink-0 text-emerald-400" />

                  <span className="min-w-0">
                    <span className="block text-xs text-zinc-500 theme-muted">
                      Email me
                    </span>
                    <span className="block break-all text-sm font-medium text-white theme-text">
                      {contact.email}
                    </span>
                  </span>
                </a>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={100} y={24}>
            <div className="lg:pl-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white theme-text">
                Quick Links
              </h3>

              <p className="mt-3 text-sm text-zinc-500 theme-muted">
                Explore my portfolio
              </p>

              <ul className="mt-6 space-y-4">
                {quickLinks.map(([label, id]) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition duration-200 hover:translate-x-1 hover:text-emerald-400 theme-muted"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 transition-colors group-hover:bg-emerald-400" />
                      {label}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200} y={24}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white theme-text">
                Let&apos;s Connect
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-400 theme-muted">
                Have an idea, opportunity, or project in mind? Let&apos;s
                connect and build something meaningful together.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-400 theme-card theme-border theme-muted"
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>

              <p className="mt-5 text-xs text-zinc-500 theme-muted">
                Based in Lucknow, India
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delayMs={250} y={16}>
          <div className="mt-12 border-t border-white/10 pt-7 theme-border sm:mt-16">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-xs leading-6 text-zinc-500 theme-muted">
                © {new Date().getFullYear()} Md Imtiyaz. All rights reserved.
              </p>

              <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 theme-muted">
                Designed &amp; built with
                <Heart
                  size={14}
                  className="animate-pulse fill-emerald-400 text-emerald-400"
                />
                using React &amp; Tailwind CSS
              </p>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-xs font-medium text-zinc-400 transition hover:text-emerald-400 theme-muted"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
