import { useEffect, useState } from "react";
import {
  Database,
  Inbox,
  HeartPulse,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Mail,
  MailOpen,
  ExternalLink,
} from "lucide-react";
import { Field, SaveButton } from "./AdminUI";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function makeProject() {
  return {
    title: "New Project",
    description: "",
    demo: "",
    github: "",
  };
}

export default function AdminEditors({
  active,
  data,
  updateField,
  onSave,
  setData,
  setNotice,
}) {
  const [health, setHealth] = useState({
    frontend: "Checking",
    api: "Checking",
    mongo: "Not verified",
  });

  const [checkingHealth, setCheckingHealth] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [inboxError, setInboxError] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const card =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

  async function handleResumeUpload() {
    if (!resumeFile) {
      setNotice("Please select a PDF file first.");
      return;
    }

    if (
      resumeFile.type !== "application/pdf" ||
      !resumeFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setNotice("Only PDF files are allowed.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setNotice("PDF size must be 5 MB or less.");
      return;
    }

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      setNotice("Admin session expired. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    setUploadingResume(true);
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/api/admin/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Resume upload failed.");
      }

      setData((previous) => ({
        ...previous,
        hero: {
          ...previous.hero,
          resumeUrl: result.resumeUrl,
        },
      }));

      setResumeFile(null);
      setNotice(
        "Resume uploaded successfully. Click Save Hero to save changes.",
      );
    } catch (error) {
      setNotice(error.message || "Resume upload failed.");
    } finally {
      setUploadingResume(false);
    }
  }

  async function checkHealth() {
    setCheckingHealth(true);

    setHealth({
      frontend: "Online",
      api: "Checking",
      mongo: "Checking",
    });

    try {
      const response = await fetch(`${API_URL}/api/health`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("API health check failed");
      }

      setHealth({
        frontend: "Online",
        api: "Online",
        mongo:
          result.services?.mongodb === "connected"
            ? "Connected"
            : "Disconnected",
      });
    } catch {
      setHealth({
        frontend: "Online",
        api: "Offline",
        mongo: "Unknown",
      });
    } finally {
      setCheckingHealth(false);
    }
  }

  async function loadInquiries() {
    setLoadingInbox(true);
    setInboxError("");

    try {
      const token = sessionStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Admin session nahi mila. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/inquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load inquiries.");
      }

      setInquiries(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setInboxError(error.message || "Unable to load messages.");
    } finally {
      setLoadingInbox(false);
    }
  }

  async function toggleInquiryRead(inquiry) {
    setInboxError("");

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/inquiries/${inquiry._id}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isRead: !inquiry.isRead,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update inquiry.");
      }

      setInquiries((previous) =>
        previous.map((item) =>
          item._id === inquiry._id
            ? { ...item, isRead: result.data.isRead }
            : item,
        ),
      );
    } catch (error) {
      setInboxError(error.message || "Unable to update message.");
    }
  }

  async function deleteInquiry(inquiry) {
    const confirmed = window.confirm("Delete this inquiry permanently?");

    if (!confirmed) return;

    setInboxError("");

    try {
      const token = sessionStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/inquiries/${inquiry._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete inquiry.");
      }

      setInquiries((previous) =>
        previous.filter((item) => item._id !== inquiry._id),
      );
    } catch (error) {
      setInboxError(error.message || "Unable to delete message.");
    }
  }

  useEffect(() => {
    if (active === "health") {
      checkHealth();
    }

    if (active === "inbox") {
      loadInquiries();
    }
  }, [active]);

  if (active === "hero") {
    return (
      <div className={`${card} space-y-5`}>
        {[
          ["name", "Your name"],
          ["role", "Professional role"],
          ["tagline", "Hero tagline"],
        ].map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={data.hero[key] ?? ""}
            multiline={key === "tagline"}
            onChange={(value) => updateField("hero", key, value)}
          />
        ))}

        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800">Upload New Resume</h3>

          <p className="text-sm text-slate-500">
            Select a PDF file. Maximum size: 5 MB.
          </p>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-4 file:py-2 file:font-semibold file:text-violet-700"
          />

          {resumeFile && (
            <p className="break-all text-sm text-slate-600">
              Selected: {resumeFile.name}
            </p>
          )}

          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={!resumeFile || uploadingResume}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingResume ? "Uploading..." : "Upload Resume"}
          </button>

          {data.hero.resumeUrl && (
            <a
              href={data.hero.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="block break-all text-sm text-violet-700 hover:underline"
            >
              View Current Resume
            </a>
          )}
        </div>

        <SaveButton label="Save Hero" onClick={() => onSave("hero")} />
      </div>
    );
  }

  if (active === "about") {
    return (
      <div className={`${card} space-y-5`}>
        {[
          ["heading", "About heading"],
          ["description", "About description"],
          ["experience", "Experience"],
          ["projectsCompleted", "Projects completed"],
        ].map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={data.about[key] ?? ""}
            multiline={key === "description"}
            onChange={(value) => updateField("about", key, value)}
          />
        ))}

        <div className="border-t border-slate-100 pt-5">
          <h3 className="mb-4 font-semibold text-slate-800">Portfolio Stats</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {Object.entries(data.stats || {}).map(([key, value]) => (
              <Field
                key={key}
                label={key === "learning" ? "Learning focus" : key}
                value={value ?? ""}
                onChange={(nextValue) => updateField("stats", key, nextValue)}
              />
            ))}
          </div>
        </div>

        <SaveButton
          label="Save About & Stats"
          onClick={() => onSave("about")}
        />
      </div>
    );
  }

  if (active === "skills") {
    return (
      <div className={`${card} space-y-5`}>
        <Field
          label="Technical skills (comma separated)"
          value={data.skills.technical ?? ""}
          multiline
          onChange={(value) => updateField("skills", "technical", value)}
        />

        <Field
          label="Tools (comma separated)"
          value={data.skills.tools ?? ""}
          multiline
          onChange={(value) => updateField("skills", "tools", value)}
        />

        <SaveButton label="Save Skills" onClick={() => onSave("skills")} />
      </div>
    );
  }

  if (active === "projects") {
    const projects = data.projects || {};

    const projectEntries = Array.isArray(projects)
      ? projects.map((project, index) => [String(index), project])
      : Object.entries(projects);

    function updateProject(key, field, value) {
      setData((previous) => {
        if (Array.isArray(previous.projects)) {
          const nextProjects = [...previous.projects];

          nextProjects[Number(key)] = {
            ...nextProjects[Number(key)],
            [field]: value,
          };

          return { ...previous, projects: nextProjects };
        }

        return {
          ...previous,
          projects: {
            ...previous.projects,
            [key]: {
              ...previous.projects[key],
              [field]: value,
            },
          },
        };
      });

      setNotice("");
    }

    function addProject() {
      setData((previous) => {
        if (Array.isArray(previous.projects)) {
          return {
            ...previous,
            projects: [...previous.projects, makeProject()],
          };
        }

        let key = `project${Object.keys(previous.projects || {}).length + 1}`;
        let suffix = 1;

        while (previous.projects?.[key]) {
          suffix += 1;
          key = `project${suffix}`;
        }

        return {
          ...previous,
          projects: {
            ...previous.projects,
            [key]: makeProject(),
          },
        };
      });

      setNotice("New project added as an unsaved draft.");
    }

    function deleteProject(key) {
      const confirmed = window.confirm(
        "Delete this project from the editor? Save Projects to persist the change.",
      );

      if (!confirmed) return;

      setData((previous) => {
        if (Array.isArray(previous.projects)) {
          return {
            ...previous,
            projects: previous.projects.filter(
              (_, index) => index !== Number(key),
            ),
          };
        }

        const nextProjects = { ...previous.projects };
        delete nextProjects[key];

        return { ...previous, projects: nextProjects };
      });

      setNotice("Project removed from the draft. Save Projects to persist.");
    }

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            {projectEntries.length} project(s)
          </p>

          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Plus size={17} />
            Add Project
          </button>
        </div>

        {projectEntries.map(([key, project], index) => (
          <div key={key} className={`${card} space-y-4`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {project.title || `Project ${index + 1}`}
              </h3>

              <button
                type="button"
                onClick={() => deleteProject(key)}
                title="Delete project"
                className="rounded-lg border border-red-100 p-2.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={17} />
              </button>
            </div>

            {[
              ["title", "Project title"],
              ["description", "Description"],
              ["demo", "Live demo URL"],
              ["github", "GitHub URL"],
            ].map(([field, label]) => (
              <Field
                key={field}
                label={label}
                value={project[field] ?? ""}
                multiline={field === "description"}
                onChange={(value) => updateProject(key, field, value)}
              />
            ))}
          </div>
        ))}

        <SaveButton
          label="Save All Projects"
          onClick={() => onSave("projects")}
        />
      </div>
    );
  }

  if (active === "contact") {
    return (
      <div className={`${card} space-y-5`}>
        {Object.entries(data.contact || {}).map(([key, value]) => (
          <Field
            key={key}
            label={key === "x" ? "X URL" : key}
            value={value ?? ""}
            onChange={(nextValue) => updateField("contact", key, nextValue)}
          />
        ))}

        <SaveButton
          label="Save Contact & Socials"
          onClick={() => onSave("contact")}
        />
      </div>
    );
  }

  if (active === "settings") {
    return (
      <div className={`${card} space-y-5`}>
        <Field
          label="Website title"
          value={data.settings.siteTitle ?? ""}
          onChange={(value) => updateField("settings", "siteTitle", value)}
        />

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span className="text-sm font-medium text-slate-700">
            Maintenance mode
          </span>

          <input
            type="checkbox"
            checked={data.settings.maintenance === "true"}
            onChange={(event) =>
              updateField(
                "settings",
                "maintenance",
                String(event.target.checked),
              )
            }
            className="h-4 w-4 accent-violet-600"
          />
        </label>

        <p className="text-xs text-slate-500">
          Saving this setting stores it in the database. It does not
          automatically enable a maintenance screen on the public website.
        </p>

        <SaveButton label="Save Settings" onClick={() => onSave("settings")} />
      </div>
    );
  }

  if (active === "backup") {
    function exportJSON() {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "portfolio-backup.json";
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function importJSON(event) {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const parsed = JSON.parse(await file.text());

        if (
          !parsed ||
          typeof parsed !== "object" ||
          !parsed.hero ||
          !parsed.projects ||
          !parsed.about ||
          !parsed.skills
        ) {
          throw new Error("Invalid backup structure");
        }

        setData((previous) => ({ ...previous, ...parsed }));

        setNotice(
          "Backup imported as an unsaved draft. Click Save All to persist it.",
        );
      } catch {
        setNotice("Invalid backup file. Please select a valid portfolio JSON.");
      } finally {
        event.target.value = "";
      }
    }

    return (
      <div className={`${card} space-y-4`}>
        <Database size={28} className="text-violet-600" />

        <h3 className="text-lg font-semibold">Portfolio backup</h3>

        <p className="text-sm text-slate-500">
          Export the current editor data or import a JSON draft. Importing does
          not write to MongoDB until you save.
        </p>

        <div className="flex flex-wrap gap-3">
          <SaveButton label="Export JSON" onClick={exportJSON} />

          <label className="cursor-pointer rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-violet-500">
            Import JSON
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={importJSON}
            />
          </label>
        </div>
      </div>
    );
  }

  if (active === "health") {
    const rows = [
      ["Frontend", health.frontend],
      ["Admin API", health.api],
      ["MongoDB", health.mongo],
    ];

    return (
      <div className={`${card} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <HeartPulse className="mb-2 text-violet-600" size={28} />

            <h3 className="font-semibold text-slate-900">System Health</h3>

            <p className="mt-1 text-sm text-slate-500">
              Check frontend availability and the API health endpoint.
            </p>
          </div>

          <button
            type="button"
            onClick={checkHealth}
            disabled={checkingHealth}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:border-violet-400 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={checkingHealth ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {rows.map(([name, status]) => {
          const online = ["Online", "Connected"].includes(status);

          return (
            <div
              key={name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
            >
              <span className="text-sm text-slate-700">{name}</span>

              <span
                className={`flex items-center gap-2 text-xs ${
                  online ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {online ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {status}
              </span>
            </div>
          );
        })}

        <p className="text-xs text-slate-500">
          MongoDB connection status is verified through the API health endpoint.
        </p>
      </div>
    );
  }

  if (active === "inbox") {
    const unreadCount = inquiries.filter((item) => !item.isRead).length;

    return (
      <div className={`${card} space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Inbox size={28} className="text-violet-600" />

            <h3 className="mt-3 text-lg font-semibold text-slate-900">
              Inquiries Inbox
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {inquiries.length} message(s) · {unreadCount} unread
            </p>
          </div>

          <button
            type="button"
            onClick={loadInquiries}
            disabled={loadingInbox}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:border-violet-400 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loadingInbox ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {inboxError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {inboxError}
          </div>
        )}

        {loadingInbox && inquiries.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading messages...
          </p>
        )}

        {!loadingInbox && !inboxError && inquiries.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
            <Inbox size={30} className="mx-auto text-slate-400" />

            <p className="mt-3 font-medium text-slate-700">No messages yet</p>

            <p className="mt-1 text-sm text-slate-500">
              Messages sent through your portfolio contact form will appear
              here.
            </p>
          </div>
        )}

        {inquiries.map((inquiry) => (
          <article
            key={inquiry._id}
            className={`rounded-xl border p-4 sm:p-5 ${
              inquiry.isRead
                ? "border-slate-200 bg-white"
                : "border-violet-200 bg-violet-50/40"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="break-words font-semibold text-slate-900">
                    {inquiry.name}
                  </h4>

                  {!inquiry.isRead && (
                    <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
                      New
                    </span>
                  )}
                </div>

                <a
                  href={`mailto:${inquiry.email}`}
                  className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm text-violet-700 hover:underline"
                >
                  {inquiry.email}
                  <ExternalLink size={13} />
                </a>
              </div>

              <p className="text-xs text-slate-500">
                {inquiry.createdAt
                  ? new Date(inquiry.createdAt).toLocaleString()
                  : ""}
              </p>
            </div>

            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {inquiry.message}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200/70 pt-4">
              <button
                type="button"
                onClick={() => toggleInquiryRead(inquiry)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-violet-400"
              >
                {inquiry.isRead ? (
                  <>
                    <Mail size={15} />
                    Mark Unread
                  </>
                ) : (
                  <>
                    <MailOpen size={15} />
                    Mark Read
                  </>
                )}
              </button>

              <a
                href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                  "Re: Your portfolio inquiry",
                )}`}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"
              >
                <Mail size={15} />
                Reply by Email
              </a>

              <button
                type="button"
                onClick={() => deleteInquiry(inquiry)}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className={card}>
      <p className="text-sm text-slate-500">
        Select a section from the sidebar.
      </p>
    </div>
  );
}
