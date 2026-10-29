import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function AdminLayout() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
      setStatus("unauthorized");
      return;
    }

    const controller = new AbortController();

    async function verifySession() {
      try {
        const response = await fetch(`${API_URL}/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          sessionStorage.removeItem("adminToken");
          setStatus("unauthorized");
          return;
        }

        setStatus("authorized");
      } catch {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    }

    verifySession();

    return () => controller.abort();
  }, []);

  if (status === "checking") {
    return (
      <main className="theme-bg theme-text flex min-h-screen items-center justify-center">
        Verifying admin session...
      </main>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin" replace />;
  }

  if (status === "error") {
    return (
      <main className="theme-bg theme-text flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Backend se connect nahi ho pa raha.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-white"
        >
          Retry
        </button>
      </main>
    );
  }

  return <Outlet />;
}
