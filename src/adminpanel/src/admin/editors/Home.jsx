import ContentEditor from "../components/ContentEditor.jsx";
import { NAV_ITEMS, HERO_MARQUEE } from "../../data/content.js";

const SECTION_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "skills", label: "Skills" },
  { value: "learning", label: "Learning" },
  { value: "projects", label: "Projects" },
  { value: "contact", label: "Contact" },
];

export default function HomeEditor() {
  return (
    <ContentEditor
      title="Home"
      description="Top menu aur hero section ka content yahan se manage karein. Koi code likhne ki zaroorat nahi."
      sections={[
        {
          key: "NAV_ITEMS",
          label: "Navigation menu",
          description:
            "Site ke top menu ke links. Arrows se order badlein, ✕ se remove karein.",
          defaultValue: NAV_ITEMS,
          itemNoun: "menu item",
          addLabel: "Add menu item",
          columns: [
            {
              label: "Section",
              type: "select",
              allowEmpty: true,
              placeholder: "Choose section",
              options: SECTION_OPTIONS,
            },
            { label: "Menu label", placeholder: "Home" },
          ],
        },
        {
          key: "HERO_MARQUEE",
          label: "Hero marquee",
          description:
            "Hero section mein scroll hone wali chhoti phrases. Add ya remove kar sakte hain.",
          defaultValue: HERO_MARQUEE,
          itemNoun: "phrase",
          addLabel: "Add phrase",
          placeholder: "web development",
        },
      ]}
    />
  );
}
