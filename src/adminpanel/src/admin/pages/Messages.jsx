import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase.js";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    if (!supabase) {
      setError("Supabase configured nahi hai — .env check karein.");
      setLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Messages</h1>
          <p>Contact form se aaye messages.</p>
        </div>
        <button type="button" className="btn-ghost" onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && <div className="admin-banner admin-banner-error">{error}</div>}

      {!loading && !error && messages.length === 0 && (
        <p className="admin-hint">Abhi tak koi message nahi aaya.</p>
      )}

      {messages.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.subject || "—"}</td>
                  <td className="admin-message-cell">{message.message}</td>
                  <td>{new Date(message.created_at).toLocaleString()}</td>
                  <td>
                    <span className={message.is_read ? "admin-read" : "admin-unread"}>
                      {message.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
