import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

const PAGES = [
  { label: "Home", path: "/admin/home", keys: ["NAV_ITEMS", "HERO_MARQUEE"] },
  { label: "About", path: "/admin/about", keys: ["ABOUT_TAGS", "EDUCATION"] },
  {
    label: "Skills",
    path: "/admin/skills",
    keys: ["SKILL_GROUPS", "SOFT_SKILLS", "STATS"],
  },
  { label: "Learning", path: "/admin/learning", keys: ["TRAINING"] },
  { label: "Projects", path: "/admin/projects", keys: ["PROJECTS"] },
  { label: "Contact", path: "/admin/contact", keys: ["CONTACT", "CONTACT_LINKS"] },
  { label: "Theme & Colors", path: "/admin/theme", keys: ["THEME"] },
];

const TOTAL_KEYS = PAGES.reduce((sum, page) => sum + page.keys.length, 0);

export default function Overview() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    content: {},
    updatedAt: null,
    messages: null,
    messagesError: "",
  });

  useEffect(() => {
    let active = true;

    async function load() {
      if (!supabase) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Supabase configured nahi hai — .env check karein.",
        }));
        return;
      }

      const [contentRes, msgRes] = await Promise.all([
        supabase.from("site_content").select("content, updated_at").eq("id", "main").single(),
        supabase.from("messages").select("id", { count: "exact", head: true }),
      ]);

      if (!active) return;

      setState({
        loading: false,
        error: contentRes.error?.message || "",
        content:
          contentRes.data?.content && typeof contentRes.data.content === "object"
            ? contentRes.data.content
            : {},
        updatedAt: contentRes.data?.updated_at || null,
        messages: msgRes.error ? null : msgRes.count ?? 0,
        messagesError: msgRes.error?.message || "",
      });
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) return <div className="admin-page">Loading…</div>;

  const savedKeys = Object.entries(state.content).filter(
    ([, value]) => value !== null && value !== undefined
  ).length;

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Portfolio content ka status aur quick links.</p>
        </div>
      </div>

      {state.error && (
        <div className="admin-banner admin-banner-error">Content load error: {state.error}</div>
      )}

      <div className="overview-grid">
        <div className="overview-card">
          <div className="value">
            {savedKeys} <span className="value-total">/ {TOTAL_KEYS}</span>
          </div>
          <div className="label">Content sections saved</div>
        </div>
        <div className="overview-card">
          <div className="value">{state.messages === null ? "—" : state.messages}</div>
          <div className="label">Contact messages</div>
          {state.messagesError && <div className="overview-error">{state.messagesError}</div>}
        </div>
        <div className="overview-card">
          <div className="value">{PAGES.length}</div>
          <div className="label">Editors available</div>
        </div>
        <div className="overview-card">
          <div className="value value-small">
            {state.updatedAt ? new Date(state.updatedAt).toLocaleString() : "Never"}
          </div>
          <div className="label">Last content update</div>
        </div>
      </div>

      <h2 className="admin-section-title">Content editors</h2>
      <ul className="section-list">
        {PAGES.map((page) => {
          const saved = page.keys.filter((key) => {
            const value = state.content[key];
            return value !== null && value !== undefined;
          }).length;
          return (
            <li key={page.path}>
              <span className="section-name">{page.label}</span>
              <span className={`source-badge ${saved > 0 ? "saved" : "default"}`}>
                {saved > 0 ? `${saved}/${page.keys.length} saved` : "Defaults"}
              </span>
              <Link to={page.path}>Open →</Link>
            </li>
          );
        })}
      </ul>

      <p className="admin-hint">
        Editors default portfolio content dikhate hain. Save karne par wahi key Supabase mein
        store hoti hai aur live site use turant padh leti hai. “Reset to default” se override
        hata kar wapas default content par aa sakte hain.
      </p>
    </div>
  );
}
