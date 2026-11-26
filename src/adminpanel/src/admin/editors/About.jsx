import ContentEditor from "../components/ContentEditor.jsx";
import { ABOUT_TAGS, EDUCATION } from "../../data/content.js";

export default function AboutEditor() {
  return (
    <ContentEditor
      title="About"
      description="About section ke tags aur education timeline ko simple form se edit karein."
      sections={[
        {
          key: "ABOUT_TAGS",
          label: "About tags",
          description:
            "Location, degree aur strengths jaise chhote tags. Add/remove kar sakte hain.",
          defaultValue: ABOUT_TAGS,
          itemNoun: "tag",
          addLabel: "Add tag",
          placeholder: "Quick learner",
        },
        {
          key: "EDUCATION",
          label: "Education timeline",
          description:
            "Har degree ya course alag card hai. Arrows se order badlein.",
          defaultValue: EDUCATION,
          itemNoun: "education entry",
          addLabel: "Add education",
          itemLabel: "degree",
          fields: {
            period: { label: "Period", placeholder: "2025 – Present" },
            degree: {
              label: "Degree / course",
              placeholder: "Master of Computer Application (MCA)",
            },
            institute: {
              label: "Institute",
              placeholder: "University or college name",
              full: true,
            },
          },
        },
      ]}
    />
  );
}
