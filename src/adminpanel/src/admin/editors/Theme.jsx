import ContentEditor from "../components/ContentEditor.jsx";
import { THEME } from "../../data/content.js";

export default function ThemeEditor() {
  return (
    <ContentEditor
      title="Theme & Colors"
      description="Site ke colours colour picker se badlein — koi CSS value yaad rakhne ki zaroorat nahi."
      sections={[
        {
          key: "THEME",
          label: "Colour tokens",
          description:
            "Har token ka colour swatch aur picker. Picker se colour choose karein, ya hex code type karein.",
          defaultValue: THEME,
          fields: {
            canvas: {
              label: "Page background",
              type: "color",
              hint: "Site ka main background colour.",
            },
            ink: {
              label: "Main text",
              type: "color",
              hint: "Headings aur body text ka colour.",
            },
            accent: {
              label: "Accent",
              type: "color",
              hint: "Buttons, links aur highlights.",
            },
            accentDeep: {
              label: "Deep accent",
              type: "color",
              hint: "Hover states aur darker details.",
            },
            accentSoft: {
              label: "Soft accent",
              type: "color",
              hint: "Light backgrounds aur badges.",
            },
          },
        },
      ]}
    />
  );
}
