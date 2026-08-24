/**
 * Brevo email client and send helpers.
 * Phase 2: send enquiry confirmations and admin notifications.
 */
export function getBrevoConfig() {
  return {
    apiKey: process.env.BREVO_API_KEY || "",
    senderEmail: process.env.BREVO_SENDER_EMAIL || "",
  };
}

export async function sendEmail() {
  throw new Error("Brevo email sending is not configured yet.");
}
