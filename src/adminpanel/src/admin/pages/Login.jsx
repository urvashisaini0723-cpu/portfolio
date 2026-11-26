import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!supabase) { setError("Supabase not configured."); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else navigate("/admin");
  }

  return (
    <div className="admin-login">
      <form onSubmit={submit} className="admin-login-card">
        <h1>urvashi* Admin</h1>
        <p>Sign in to manage your portfolio</p>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <div className="pw-wrap">
          <input type={show?"text":"password"} placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="button" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button>
        </div>
        {error && <div className="admin-error">{error}</div>}
        <button type="submit" disabled={loading}>{loading?"Signing in…":"Sign in"}</button>
      </form>
    </div>
  );
}
