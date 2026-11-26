import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

export function AdminGuard({ children }) {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <div className="admin-loading">Loading…</div>;
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}
