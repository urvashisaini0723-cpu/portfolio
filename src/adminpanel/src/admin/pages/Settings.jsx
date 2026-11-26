import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

export default function Settings() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  async function testConnection() {
    setTesting(true);
    setResult(null);

    if (!supabase) {
      setResult({
        ok: false,
        text: "Supabase client configured nahi hai. .env mein VITE_SUPABASE_URL aur VITE_SUPABASE_PUBLISHABLE_KEY check karein.",
      });
      setTesting(false);
      return;
    }

    const { error } = await supabase
      .from("site_content")
      .select("id")
      .eq("id", "main")
      .single();

    setResult(
      error
        ? { ok: false, text: `Connection failed: ${error.message}` }
        : { ok: true, text: "Supabase connection OK — site_content readable hai." }
    );
    setTesting(false);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Connection aur environment ki jaankari.</p>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-head">
          <h2>Supabase</h2>
          <span className={`source-badge ${supabase ? "saved" : "default"}`}>
            {supabase ? "Client ready" : "Not configured"}
          </span>
        </div>
        <p className="content-hint">
          URL aur publishable key <code>.env</code> se padhi jaati hain. Secret/service key
          frontend mein kabhi use nahi hoti.
        </p>
        <ul className="settings-list">
          <li>
            <code>VITE_SUPABASE_URL</code>
            <span>Project URL</span>
          </li>
          <li>
            <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>
            <span>Browser-safe key (anon/publishable)</span>
          </li>
        </ul>
        <div className="content-actions">
          <button type="button" className="btn-primary" onClick={testConnection} disabled={testing}>
            {testing ? "Testing…" : "Test connection"}
          </button>
          {result && (
            <span className={result.ok ? "status-ok" : "status-err"}>{result.text}</span>
          )}
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-head">
          <h2>Content storage</h2>
        </div>
        <p className="content-hint">
          Saara editable content Supabase ke <code>site_content</code> table mein <code>main</code>{" "}
          row ke andar structured data ke roop mein save hota hai. Contact form ke messages{" "}
          <code>messages</code> table mein aate hain.
        </p>
      </div>
    </div>
  );
}
