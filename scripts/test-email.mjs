import "dotenv/config";
import { getContactConfig, sendContactEmail } from "../server/contactApi.js";

const { apiKey, toEmail, fromEmail } = getContactConfig();

if (!apiKey) {
  console.error("BREVO_API_KEY is missing. Add it to .env first.");
  process.exitCode = 1;
} else {
  console.log(`Sending a test email from ${fromEmail} to ${toEmail} ...`);
  try {
    const result = await sendContactEmail({
      name: "Portfolio test",
      email: toEmail,
      message:
        "This is a test message from your portfolio contact form setup. If you received it, email sending works.",
    });
    console.log("Test email sent successfully.");
    if (result.messageId) console.log(`Brevo message ID: ${result.messageId}`);
  } catch (error) {
    console.error("Test email failed:", error.code || "error");
    console.error(error.detail || error.message);
    process.exitCode = 1;
  }
}
