import { Routes, Route, Navigate } from "react-router-dom";
import Overview from "../pages/Overview.jsx";
import HomeEditor from "../editors/Home.jsx";
import AboutEditor from "../editors/About.jsx";
import SkillsEditor from "../editors/Skills.jsx";
import LearningEditor from "../editors/Learning.jsx";
import ProjectsEditor from "../editors/Projects.jsx";
import ContactEditor from "../editors/Contact.jsx";
import Messages from "../pages/Messages.jsx";
import ThemeEditor from "../editors/Theme.jsx";
import Settings from "../pages/Settings.jsx";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="home" element={<HomeEditor />} />
      <Route path="about" element={<AboutEditor />} />
      <Route path="skills" element={<SkillsEditor />} />
      <Route path="learning" element={<LearningEditor />} />
      <Route path="projects" element={<ProjectsEditor />} />
      <Route path="contact" element={<ContactEditor />} />
      <Route path="messages" element={<Messages />} />
      <Route path="theme" element={<ThemeEditor />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
