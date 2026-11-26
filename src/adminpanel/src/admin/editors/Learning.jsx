import ContentEditor from "../components/ContentEditor.jsx";
import { TRAINING } from "../../data/content.js";

export default function LearningEditor() {
  return (
    <ContentEditor
      title="Learning"
      description="Training aur courses ka content simple cards mein edit karein."
      sections={[
        {
          key: "TRAINING",
          label: "Training & courses",
          description:
            "Har training ka naam, organisation aur highlights. Highlights add/remove kar sakte hain.",
          defaultValue: TRAINING,
          itemNoun: "training",
          addLabel: "Add training",
          itemLabel: "title",
          fields: {
            title: {
              label: "Course / training name",
              placeholder: "C & C++ Training Program",
            },
            org: {
              label: "Institute / organisation",
              placeholder: "HARTRON Skill Centre, Panchkula",
            },
            points: {
              label: "Highlights",
              itemNoun: "highlight",
              addLabel: "Add highlight",
              placeholder: "Fundamentals and advanced concepts in C and C++",
              multilineItems: true,
              full: true,
            },
          },
        },
      ]}
    />
  );
}
