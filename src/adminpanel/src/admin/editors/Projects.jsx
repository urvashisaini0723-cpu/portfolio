import ContentEditor from "../components/ContentEditor.jsx";
import { PROJECTS } from "../../data/content.js";

export default function ProjectsEditor() {
  return (
    <ContentEditor
      title="Projects"
      description="Portfolio ke projects add, edit, reorder ya remove karein."
      sections={[
        {
          key: "PROJECTS",
          label: "Projects",
          description:
            "Har project ka card. Naya project add karne ke liye neeche button dabayein.",
          defaultValue: PROJECTS,
          itemNoun: "project",
          addLabel: "Add project",
          itemLabel: "name",
          fields: {
            name: { label: "Project name", placeholder: "Burger Rush" },
            type: { label: "Type", placeholder: "Website" },
            image: {
              label: "Image path or URL",
              placeholder: "/img/project.svg",
              hint: "Portfolio ki public image ka path, ya poora https:// link.",
              full: true,
            },
            url: {
              label: "Project link",
              type: "url",
              placeholder: "https://example.com",
            },
            label: { label: "Link text", placeholder: "example.com" },
            desc: {
              label: "Description",
              type: "textarea",
              rows: 3,
              placeholder: "Short description of the project",
              full: true,
            },
          },
        },
      ]}
    />
  );
}
