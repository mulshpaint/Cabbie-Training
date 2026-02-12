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

// Replace with a hosted logo URL once available (e.g. https://yourdomain.com/logo.png)
const LOGO_URL = process.env.EMAIL_LOGO_URL || "";

const emailLogo = LOGO_URL
  ? `<img src="${LOGO_URL}" alt="Cabbie Training" style="height: 40px; margin-bottom: 24px;" />`
  : `<div style="margin-bottom: 24px;"><span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Cabbie</span><span style="font-size: 22px; font-weight: 800; color: #38bdf8; letter-spacing: -0.5px;">Training</span></div>`;

// Shared email wrapper styles
const emailWrapper = (content: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0d1f3c; color: #e2eaf6; padding: 40px; border-radius: 12px;">
    ${emailLogo}
    ${content}
    <hr style="border: none; border-top: 1px solid #1e3a5f; margin: 30px 0 20px;" />
    <p style="font-size: 13px; color: #8899b0;">If you have any questions, reply to this email or call us on <strong>07739 320050</strong>.</p>
    <p style="font-size: 13px; color: #8899b0;">Cabbie Training — Cottis House, Locks Hills, South Street, Rochford, Essex, SS4 1BB</p>
  </div>
`;

const detailsBlock = (details: { label: string; value: string }[]) => `
  <div style="background: #162b50; padding: 20px; border-radius: 8px; margin: 20px 0;">
    ${details.map((d) => `<p style="margin: 4px 0;"><strong>${d.label}:</strong> ${d.value}</p>`).join("")}
  </div>
`;

interface BookingEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  council: string;
  courseDate: string;
  courseTime: string;
  courseLocation: string;
  price: number;
}

export async function sendBookingConfirmation(booking: BookingEmailData) {
  const dateTimeDisplay = booking.courseTime
    ? `${booking.courseDate} at ${booking.courseTime}`
    : booking.courseDate;

  await sendEmail({
    to: [{ email: booking.email, name: `${booking.firstName} ${booking.lastName}` }],
    subject: "Booking Confirmed — Cabbie Training PAT Course",
    htmlContent: emailWrapper(`
      <h1 style="color: #38bdf8; margin-bottom: 8px;">Booking Confirmed!</h1>
      <p>Hi ${booking.firstName},</p>
      <p>Your place on the PAT course has been confirmed. Here are your details:</p>
      ${detailsBlock([
        { label: "Date", value: dateTimeDisplay },
        { label: "Location", value: booking.courseLocation },
        { label: "Price", value: `£${booking.price}` },
      ])}
      <h3 style="color: #38bdf8;">What to bring</h3>
      <ul>
        <li>Photo ID</li>
        <li>That's it — all materials are provided!</li>
      </ul>
      <h3 style="color: #38bdf8;">Location</h3>
      <p>Cottis House, Locks Hills, South Street, Rochford, Essex, SS4 1BB</p>
      <p style="margin-top: 30px;">See you there!<br/><strong>Wendy Clarke</strong><br/>Cabbie Training</p>
    `),
  });

  await sendEmail({
    to: [{ email: "info@cabbietraining.co.uk", name: "Cabbie Training" }],
    subject: `New Booking: ${booking.firstName} ${booking.lastName} — ${dateTimeDisplay}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking Received</h2>
        <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></p>
        <p><strong>Phone:</strong> <a href="tel:${booking.phone}">${booking.phone}</a></p>
        <p><strong>Council:</strong> ${booking.council}</p>
        <p><strong>Date:</strong> ${dateTimeDisplay}</p>
        <p><strong>Location:</strong> ${booking.courseLocation}</p>
        <p><strong>Price:</strong> £${booking.price}</p>
      </div>
    `,
  });
}

export async function sendBookingCancellation(booking: {
  firstName: string;
  lastName: string;
  email: string;
  courseDate: string;
  courseTime: string;
  courseLocation: string;
}) {
  const dateTimeDisplay = booking.courseTime
    ? `${booking.courseDate} at ${booking.courseTime}`
    : booking.courseDate;

  await sendEmail({
    to: [{ email: booking.email, name: `${booking.firstName} ${booking.lastName}` }],
    subject: "Booking Cancelled — Cabbie Training",
    htmlContent: emailWrapper(`
      <h1 style="color: #f87171; margin-bottom: 8px;">Booking Cancelled</h1>
      <p>Hi ${booking.firstName},</p>
      <p>Your booking for the following course has been cancelled:</p>
      ${detailsBlock([
        { label: "Date", value: dateTimeDisplay },
        { label: "Location", value: booking.courseLocation },
      ])}
      <p>If you believe this was a mistake or would like to rebook, please get in touch and we'll be happy to help.</p>
    `),
  });
}

export async function sendRefundConfirmation(booking: {
  firstName: string;
  lastName: string;
  email: string;
  courseDate: string;
  courseTime: string;
  courseLocation: string;
  price: number;
}) {
  const dateTimeDisplay = booking.courseTime
    ? `${booking.courseDate} at ${booking.courseTime}`
    : booking.courseDate;

  await sendEmail({
    to: [{ email: booking.email, name: `${booking.firstName} ${booking.lastName}` }],
    subject: "Refund Issued — Cabbie Training",
    htmlContent: emailWrapper(`
      <h1 style="color: #a78bfa; margin-bottom: 8px;">Refund Issued</h1>
      <p>Hi ${booking.firstName},</p>
      <p>A full refund of <strong>£${booking.price}</strong> has been issued for your booking:</p>
      ${detailsBlock([
        { label: "Date", value: dateTimeDisplay },
        { label: "Location", value: booking.courseLocation },
        { label: "Refund Amount", value: `£${booking.price}` },
      ])}
      <p>The refund should appear in your account within 5–10 business days, depending on your bank.</p>
      <p>If you'd like to rebook for a different date, just visit our website or get in touch.</p>
    `),
  });
}

export async function sendContactReply(data: {
  to: string;
  toName: string;
  subject: string;
  replyMessage: string;
  originalMessage: string;
}) {
  await sendEmail({
    to: [{ email: data.to, name: data.toName }],
    subject: data.subject,
    htmlContent: emailWrapper(`
      <h1 style="color: #38bdf8; margin-bottom: 8px;">We've replied to your enquiry</h1>
      <p>Hi ${data.toName.split(" ")[0]},</p>
      <p style="white-space: pre-wrap;">${data.replyMessage}</p>
      <div style="background: #162b50; padding: 16px; border-radius: 8px; margin: 24px 0; border-left: 3px solid #38bdf8;">
        <p style="font-size: 12px; color: #8899b0; margin: 0 0 8px;">Your original message:</p>
        <p style="font-size: 13px; color: #c0cfe0; margin: 0; white-space: pre-wrap;">${data.originalMessage}</p>
      </div>
      <p style="margin-top: 30px;">Kind regards,<br/><strong>Wendy Clarke</strong><br/>Cabbie Training</p>
    `),
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
        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        <p><strong>Phone:</strong> ${contact.phone ? `<a href="tel:${contact.phone}">${contact.phone}</a>` : "Not provided"}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 3px solid #38bdf8; padding-left: 16px; color: #555;">${contact.message}</blockquote>
      </div>
    `,
  });
}
