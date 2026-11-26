import { Outlet, NavLink, useNavigate } from "react-router-dom";
import AdminRoutes from "../routes/index.jsx";
import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

const MENU = [
  ["Overview","/admin","📊"],
  ["Home","/admin/home","🏠"],
  ["About","/admin/about","👤"],
  ["Skills","/admin/skills","🛠"],
  ["Learning","/admin/learning","📚"],
  ["Projects","/admin/projects","🚀"],
  ["Contact","/admin/contact","✉️"],
  ["Messages","/admin/messages","💬"],
  ["Theme & Colors","/admin/theme","🎨"],
  ["Settings","/admin/settings","⚙️"],
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  async function logout() {
    if (supabase) await supabase.auth.signOut();
    navigate("/admin/login");
  }
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open?"open":""}`}>
        <div className="admin-brand">urvashi* Admin</div>
        <nav>
          {MENU.map(([label,path,icon])=>(
            <NavLink key={path} to={path} end={path==="/admin"} className={({isActive})=>isActive?"active":""} onClick={()=>setOpen(false)}>
              <span>{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>🚪 Logout</button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="hamburger" onClick={()=>setOpen(!open)}>☰</button>
          <h2>Admin Panel</h2>
          <div className="admin-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="btn">View live site</a>
          </div>
        </header>
        <main className="admin-content">
          <AdminRoutes />
        </main>
      </div>
    </div>
  );
}
