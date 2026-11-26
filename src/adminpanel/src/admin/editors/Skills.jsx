import ContentEditor from "../components/ContentEditor.jsx";
import { SKILL_GROUPS, SOFT_SKILLS, STATS } from "../../data/content.js";

export default function SkillsEditor() {
  return (
    <ContentEditor
      title="Skills"
      description="Skill groups, soft skills aur stats cards ko bina code ke manage karein."
      sections={[
        {
          key: "SKILL_GROUPS",
          label: "Skill groups",
          description:
            "Har group ka naam, chhota note aur uske skills. Skills ke andar Add skill se naye items add karein.",
          defaultValue: SKILL_GROUPS,
          itemNoun: "skill group",
          addLabel: "Add skill group",
          itemLabel: "name",
          fields: {
            name: { label: "Group name", placeholder: "Programming Languages" },
            note: { label: "Short note", placeholder: "Languages I build with" },
            skills: {
              label: "Skills",
              itemNoun: "skill",
              addLabel: "Add skill",
              placeholder: "JavaScript",
              full: true,
            },
          },
        },
        {
          key: "SOFT_SKILLS",
          label: "Soft skills",
          description: "Soft skills ki list. Add/remove aur reorder kar sakte hain.",
          defaultValue: SOFT_SKILLS,
          itemNoun: "soft skill",
          addLabel: "Add soft skill",
          placeholder: "Strong problem-solving",
        },
        {
          key: "STATS",
          label: "Stats cards",
          description: "Number aur uske neeche ka label. Jaise 2 — projects built.",
          defaultValue: STATS,
          itemNoun: "stat",
          addLabel: "Add stat",
          columns: [
            { label: "Number", placeholder: "2" },
            { label: "Label", placeholder: "projects built & deployed online" },
          ],
        },
      ]}
    />
  );
}
