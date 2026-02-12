const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = "https://api.brevo.com/v3";

const DEFAULT_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || "info@cabbietraining.co.uk";
const DEFAULT_SENDER_NAME = process.env.BREVO_SENDER_NAME || "Cabbie Training";

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  sender?: EmailRecipient;
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  sender = { email: DEFAULT_SENDER_EMAIL, name: DEFAULT_SENDER_NAME },
}: SendEmailParams) {
  if (!BREVO_API_KEY) {
    throw new Error("Brevo email failed: BREVO_API_KEY is not configured");
  }

  const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender,
      to,
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo email failed: ${error}`);
  }

  return response.json();
}

export async function sendBookingConfirmation(booking: {
  firstName: string;
  lastName: string;
  email: string;
  courseDate: string;
  courseLocation: string;
  price: number;
}) {
  await sendEmail({
    to: [{ email: booking.email, name: `${booking.firstName} ${booking.lastName}` }],
    subject: "Booking Confirmed — Cabbie Training PAT Course",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1f3c; color: #e2eaf6; padding: 40px; border-radius: 12px;">
        <h1 style="color: #38bdf8; margin-bottom: 8px;">Booking Confirmed!</h1>
        <p>Hi ${booking.firstName},</p>
        <p>Your place on the PAT course has been confirmed. Here are your details:</p>
        <div style="background: #162b50; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Date:</strong> ${booking.courseDate}</p>
          <p style="margin: 4px 0;"><strong>Location:</strong> ${booking.courseLocation}</p>
          <p style="margin: 4px 0;"><strong>Price:</strong> £${booking.price}</p>
        </div>
        <h3 style="color: #38bdf8;">What to bring</h3>
        <ul>
          <li>Photo ID</li>
          <li>That's it — all materials are provided!</li>
        </ul>
        <h3 style="color: #38bdf8;">Location</h3>
        <p>Cottis House, Locks Hills, South Street, Rochford, Essex, SS4 1BB</p>
        <p>If you have any questions, reply to this email or call us on <strong>07739 320050</strong>.</p>
        <p style="margin-top: 30px;">See you there!<br/><strong>Wendy Clarke</strong><br/>Cabbie Training</p>
      </div>
    `,
  });

  await sendEmail({
    to: [{ email: "info@cabbietraining.co.uk", name: "Cabbie Training" }],
    subject: `New Booking: ${booking.firstName} ${booking.lastName} — ${booking.courseDate}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking Received</h2>
        <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Date:</strong> ${booking.courseDate}</p>
        <p><strong>Location:</strong> ${booking.courseLocation}</p>
        <p><strong>Price:</strong> £${booking.price}</p>
      </div>
    `,
  });
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  await sendEmail({
    to: [{ email: "info@cabbietraining.co.uk", name: "Cabbie Training" }],
    subject: `Website Contact: ${contact.subject} — ${contact.name}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 3px solid #38bdf8; padding-left: 16px; color: #555;">${contact.message}</blockquote>
      </div>
    `,
  });
}
