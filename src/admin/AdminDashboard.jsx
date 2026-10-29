import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  HeartPulse,
  FolderKanban,
  PanelsTopLeft,
  ChartNoAxesCombined,
  Code2,
  Mail,
  Inbox,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  SaveAll,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";

import { initialData, navGroups, sectionNames } from "./adminData";
import AdminEditors from "./AdminEditors";
import { SaveButton } from "./AdminUI";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const PORTFOLIO_API = `${API_URL}/api/admin/portfolio`;

const icons = {
  LayoutDashboard,
  HeartPulse,
  FolderKanban,
  PanelsTopLeft,
  ChartNoAxesCombined,
  Code2,
  Mail,
  Inbox,
  Settings,
  Database,
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(() => cloneData(initialData));
  const [savedData, setSavedData] = useState(() => cloneData(initialData));
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState("Checking");

  const token = () => sessionStorage.getItem("adminToken");

  const isDirty = (id) =>
    JSON.stringify(data[id]) !== JSON.stringify(savedData[id]);

  const dirtyCount = Object.keys(data).filter(isDirty).length;

  // Load saved portfolio sections from MongoDB
  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      const adminToken = token();

      if (!adminToken) {
        navigate("/admin", { replace: true });
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(PORTFOLIO_API, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load portfolio data");
        }

        const mergedData = cloneData(initialData);

        for (const section of result.data || []) {
          if (
            Object.prototype.hasOwnProperty.call(mergedData, section.section)
          ) {
            mergedData[section.section] = section.content;
          }
        }

        if (!cancelled) {
          setData(mergedData);
          setSavedData(cloneData(mergedData));
          setApiStatus("Connected");
          setNotice("Portfolio data loaded successfully.");
        }
      } catch (error) {
        console.error("Load portfolio error:", error);

        if (!cancelled) {
          setApiStatus("Unavailable");
          setNotice(
            "Could not load saved data. Check your backend and try refreshing.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function updateField(section, field, value, nested = null) {
    setData((previous) => ({
      ...previous,
      [section]: nested
        ? {
            ...previous[section],
            [nested]: {
              ...previous[section][nested],
              [field]: value,
            },
          }
        : {
            ...previous[section],
            [field]: value,
          },
    }));

    setNotice("");
  }

  // Save one section
  async function saveSection(section) {
    const adminToken = token();

    if (!adminToken) {
      navigate("/admin", { replace: true });
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(data, section)) {
      setNotice("Invalid portfolio section.");
      return;
    }

    setSaving(true);
    setNotice("");

    try {
      const response = await fetch(
        `${PORTFOLIO_API}/${encodeURIComponent(section)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            content: data[section],
          }),
        },
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin", { replace: true });
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save section.");
      }

      setSavedData((previous) => ({
        ...previous,
        [section]: cloneData(data[section]),
        ...(section === "about" ? { stats: cloneData(data.stats) } : {}),
      }));

      setNotice(
        `${sectionNames[section] || section} saved to MongoDB successfully.`,
      );
    } catch (error) {
      console.error("Save section error:", error);
      setNotice(error.message || "Failed to save section.");
    } finally {
      setSaving(false);
    }
  }

  // Save all sections
  async function saveAll() {
    const adminToken = token();

    if (!adminToken) {
      navigate("/admin", { replace: true });
      return;
    }

    setSaving(true);
    setNotice("");

    try {
      const sections = Object.keys(data);

      for (const section of sections) {
        const response = await fetch(
          `${PORTFOLIO_API}/${encodeURIComponent(section)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
              content: data[section],
            }),
          },
        );

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            `${sectionNames[section] || section}: ${
              result.message || "Save failed"
            }`,
          );
        }

        // Update local saved state only after this section succeeds
        setSavedData((previous) => ({
          ...previous,
          [section]: cloneData(data[section]),
        }));
      }

      setNotice("All sections saved to MongoDB successfully.");
    } catch (error) {
      console.error("Save all error:", error);
      setNotice(error.message || "Failed to save all sections.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg border border-slate-200 p-2 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
            <LayoutDashboard size={21} />
          </div>

          <div>
            <h1 className="font-bold">Portfolio CMS</h1>
            <p className="text-xs text-slate-500">Admin workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-slate-500 md:inline">
            {saving
              ? "Saving..."
              : dirtyCount
                ? `${dirtyCount} unsaved sections`
                : "All changes saved"}
          </span>

          <button
            onClick={saveAll}
            disabled={saving || loading}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <SaveAll size={16} />
            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save All"}
            </span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            title="View portfolio"
            className="hidden rounded-xl border border-slate-200 p-2.5 sm:block"
          >
            <ExternalLink size={17} />
          </a>

          <button
            onClick={logout}
            title="Logout"
            className="rounded-xl border border-slate-200 p-2.5 hover:text-red-600"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <div className="flex min-h-[calc(100vh-68px)]">
        <aside
          className={`fixed bottom-0 top-[68px] z-20 w-64 overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 rounded-2xl bg-violet-50 p-4">
            <p className="font-semibold">Administrator</p>
            <p className="mt-1 text-xs text-slate-500">Manage your portfolio</p>
          </div>

          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
                {group.title}
              </p>

              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = icons[item.icon] || LayoutDashboard;
                  const selected = active === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActive(item.id);
                        setSidebarOpen(false);
                        setNotice("");
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                        selected
                          ? "bg-violet-600 font-medium text-white shadow-md shadow-violet-200"
                          : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1">{item.label}</span>

                      {isDirty(item.id) && (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
          <div className="mx-auto max-w-5xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold tracking-[0.18em] text-violet-600">
                  PORTFOLIO MANAGEMENT
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  {sectionNames[active] || "Overview"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Manage your portfolio from one workspace.
                </p>
              </div>

              {[
                "hero",
                "about",
                "skills",
                "projects",
                "contact",
                "stats",
                "settings",
              ].includes(active) && (
                <SaveButton
                  label={saving ? "Saving..." : "Save Section"}
                  onClick={() => saveSection(active)}
                />
              )}
            </div>

            {notice && (
              <div
                role="status"
                className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                <CheckCircle2 size={18} />
                <span>{notice}</span>
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Loading saved portfolio data...
              </div>
            ) : active === "overview" ? (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    [
                      "Projects",
                      Array.isArray(data.projects)
                        ? data.projects.length
                        : Object.keys(data.projects || {}).length,
                    ],
                    [
                      "Skills groups",
                      Object.keys(data.skills || {}).filter(
                        (key) =>
                          typeof data.skills[key] === "string" &&
                          data.skills[key].trim(),
                      ).length,
                    ],
                    ["Unsaved sections", dirtyCount],
                    ["Admin API", apiStatus],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-3 text-2xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-semibold">Quick actions</h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {["hero", "projects", "skills", "contact"].map((id) => (
                      <button
                        key={id}
                        onClick={() => setActive(id)}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm hover:border-violet-400 hover:text-violet-700"
                      >
                        {sectionNames[id]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <AdminEditors
                active={active}
                data={data}
                updateField={updateField}
                onSave={saveSection}
                setData={setData}
                setNotice={setNotice}
              />
            )}

            <footer className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
              Portfolio CMS · MongoDB persistence enabled
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
