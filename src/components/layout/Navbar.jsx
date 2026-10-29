import { useEffect, useMemo, useState } from "react";
import { Code2, Menu, X, Sun, Moon } from "lucide-react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("about");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [theme, setTheme] = useState(
    () =>
      document.documentElement.dataset.theme ||
      localStorage.getItem("theme") ||
      "dark",
  );

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;

    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // Apply theme and save preference
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  // Active navigation section
  useEffect(() => {
    const elements = LINKS.map(({ id }) => document.getElementById(id)).filter(
      Boolean,
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when switching to desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      if (mediaQuery.matches) setOpen(false);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
    });

    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-black/60 theme-navbar theme-border"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("about")}
          aria-label="Go to home"
          className="group flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <Code2 className="h-8 w-8 text-accent" />

          <span className="bg-[linear-gradient(90deg,var(--page-text)_0%,#4ade80_65%)] bg-clip-text text-[29px] font-bold tracking-tight text-transparent">
            Imtiyaz
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              aria-current={active === id ? "location" : undefined}
              className={`group relative text-base font-medium transition-colors duration-200 ${
                active === id
                  ? "text-white theme-text"
                  : "text-zinc-400 theme-muted hover:text-white"
              }`}
            >
              {label}

              <span
                className={`absolute -bottom-1 left-0 h-px w-full origin-left transition-transform duration-300 ${
                  active === id
                    ? "scale-x-100 bg-white theme-text"
                    : "scale-x-0 bg-white group-hover:scale-x-100"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 theme-border text-white theme-text transition hover:border-accent hover:text-accent"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            className="inline-flex rounded-lg p-2 text-zinc-300 theme-muted transition hover:text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close navigation menu"
          className={`fixed inset-0 top-[80px] z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Menu */}
        <div
          className={`fixed left-0 top-[80px] z-50 w-full border-b border-white/10 bg-black/90 theme-navbar theme-border backdrop-blur-xl transition-all duration-300 ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-6 opacity-0"
          }`}
        >
          <div className="px-4 py-4">
            <div className="flex flex-col gap-1">
              {LINKS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    active === id
                      ? "bg-white/10 text-white theme-text"
                      : "text-zinc-300 theme-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile Hire Me */}
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="mt-4 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Hire Me
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
