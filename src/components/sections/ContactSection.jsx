import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import ScrollReveal from "../animations/ScrollReveal";
import RadialGradientBackground from "../backgrounds/RadialGradientBackground";

const NAME_MAX = 20;
const EMAIL_MAX = 30;
const MESSAGE_MAX = 250;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const DEFAULT_CONTACT = {
  email: "mdimteyz270@gmail.com",
  github: "https://github.com/mdimtiyaz93",
  linkedin: "https://www.linkedin.com/in/md-imtiyaz-765981372",
  instagram: "https://www.instagram.com/md_imtiyaz93/",
  x: "https://x.com/imtiyaz9341",
};

export default function ContactSection() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  const [fields, setFields] = useState({
    name: "",
    email: "",
    message: "",
  });

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
      } catch (err) {
        console.error("Failed to load contact details:", err);
      }
    }

    loadContact();
  }, []);

  const socials = [
    { Icon: SiGithub, href: contact.github, label: "GitHub" },
    { Icon: FaLinkedin, href: contact.linkedin, label: "LinkedIn" },
    { Icon: FaXTwitter, href: contact.x, label: "X" },
    {
      Icon: null,
      href: contact.instagram,
      label: "Instagram",
    },
  ].filter(({ href }) => Boolean(href));

  function handleChange(e) {
    const { name, value } = e.target;

    const limits = {
      name: NAME_MAX,
      email: EMAIL_MAX,
      message: MESSAGE_MAX,
    };

    if (value.length > limits[name]) return;

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  const isFormFilled =
    fields.name.trim().length > 0 &&
    fields.email.trim().length > 0 &&
    fields.message.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, message } = fields;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send your message.");
      }

      setSuccess("Message sent successfully! Thank you for contacting me.");

      setFields({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Server se connection nahi ho pa raha. Please try again."
          : err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-b border-white/5 bg-black theme-bg theme-border py-20 sm:py-28"
    >
      <RadialGradientBackground position="center" className="opacity-25" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <MessageCircle className="h-4 w-4" />
            Get in Touch
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Let&apos;s Work Together
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Have a project in mind? Let&apos;s discuss how we can bring your
            ideas to life.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal delayMs={80}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] theme-card theme-border p-6 sm:p-8">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at top right, rgba(74,222,128,0.12) 0%, transparent 65%)",
                }}
                aria-hidden="true"
              />

              <form
                id="contact-form"
                onSubmit={handleSubmit}
                noValidate
                className="relative z-10"
              >
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-name"
                        className="text-xs font-semibold uppercase tracking-wide text-zinc-400"
                      >
                        Name
                      </label>

                      <span className="text-xs text-zinc-500">
                        {fields.name.length}/{NAME_MAX}
                      </span>
                    </div>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={fields.name}
                      onChange={handleChange}
                      maxLength={NAME_MAX}
                      placeholder="Your name"
                      required
                      className="theme-input mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-email"
                        className="text-xs font-semibold uppercase tracking-wide text-zinc-400"
                      >
                        Email
                      </label>

                      <span className="text-xs text-zinc-500">
                        {fields.email.length}/{EMAIL_MAX}
                      </span>
                    </div>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={handleChange}
                      maxLength={EMAIL_MAX}
                      placeholder="your.email@example.com"
                      required
                      className="theme-input mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-message"
                        className="text-xs font-semibold uppercase tracking-wide text-zinc-400"
                      >
                        Message
                      </label>

                      <span className="text-xs text-zinc-500">
                        {fields.message.length}/{MESSAGE_MAX}
                      </span>
                    </div>

                    <textarea
                      id="contact-message"
                      name="message"
                      value={fields.message}
                      onChange={handleChange}
                      maxLength={MESSAGE_MAX}
                      rows={5}
                      placeholder="Tell me about your project..."
                      required
                      className="theme-input mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-500 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormFilled || sending}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-700"
                  >
                    {error}
                  </p>
                )}

                {success && (
                  <p
                    role="status"
                    className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm text-green-600"
                  >
                    {success}
                  </p>
                )}
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={140}>
            <div className="flex h-full flex-col">
              <h3 className="text-2xl font-bold text-white">
                Let&apos;s Connect
              </h3>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                I&apos;m open to discussing projects, sharing ideas, and
                exploring opportunities to grow as a developer. Feel free to
                connect with me.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={
                    contact.email
                      ? `mailto:${contact.email}`
                      : contact.github || "#"
                  }
                  target={contact.email ? undefined : "_blank"}
                  rel={contact.email ? undefined : "noreferrer"}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] theme-card theme-border px-4 py-4 transition hover:border-accent/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Get in touch</p>
                    <p className="text-sm font-semibold text-white">
                      {contact.email || "Connect through GitHub"}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] theme-card theme-border px-4 py-4 transition hover:border-accent/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">Location</p>
                    <p className="text-sm font-semibold text-white">
                      Lucknow, India
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-10 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Connect with me
              </p>

              <div className="mt-4 flex gap-3">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] theme-card theme-border text-zinc-400 transition hover:-translate-y-1 hover:border-accent/50 hover:text-accent"
                  >
                    {Icon ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-bold">IG</span>
                    )}
                  </a>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <p className="text-sm text-zinc-500">
                  Thanks for visiting my portfolio.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
