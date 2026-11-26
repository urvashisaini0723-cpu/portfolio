import ContentEditor from "../components/ContentEditor.jsx";
import { CONTACT, CONTACT_LINKS } from "../../data/content.js";

export default function ContactEditor() {
  return (
    <ContentEditor
      title="Contact"
      description="Contact details aur social links bina code ke update karein."
      sections={[
        {
          key: "CONTACT",
          label: "Contact details",
          description: "Email, location aur social profile links.",
          defaultValue: CONTACT,
          fields: {
            email: {
              label: "Email address",
              type: "email",
              placeholder: "you@example.com",
            },
            location: { label: "Location", placeholder: "City, State" },
            github: {
              label: "GitHub URL",
              type: "url",
              placeholder: "https://github.com/username",
            },
            githubLabel: {
              label: "GitHub display text",
              placeholder: "github.com/username",
            },
            linkedin: {
              label: "LinkedIn URL",
              type: "url",
              placeholder: "https://linkedin.com/in/username",
            },
            linkedinLabel: {
              label: "LinkedIn display text",
              placeholder: "linkedin.com/in/username",
            },
          },
        },
        {
          key: "CONTACT_LINKS",
          label: "Contact links",
          description:
            "Contact section mein dikhne wale links. Icon dropdown se choose karein.",
          defaultValue: CONTACT_LINKS,
          itemNoun: "contact link",
          addLabel: "Add contact link",
          itemLabel: "label",
          fields: {
            label: { label: "Label", placeholder: "Email" },
            value: {
              label: "Display text",
              placeholder: "you@example.com",
            },
            href: {
              label: "Link",
              nullable: true,
              placeholder: "https://... or mailto:...",
              hint: "Location jaise plain text ke liye blank chhod dein.",
              full: true,
            },
            icon: {
              label: "Icon",
              type: "select",
              options: [
                { value: "mail", label: "Email" },
                { value: "github", label: "GitHub" },
                { value: "linkedin", label: "LinkedIn" },
                { value: "location", label: "Location" },
              ],
            },
            external: { label: "Opens in a new tab", type: "checkbox" },
          },
        },
      ]}
    />
  );
}
