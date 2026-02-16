import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cabbie Training",
  description:
    "How Cabbie Training collects, uses, and protects your personal data under UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-navy min-h-screen px-[5%] py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-accent-blue text-sm hover:underline mb-8 inline-block"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-3xl font-extrabold text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: 16 February 2025
        </p>

        <div className="prose-custom space-y-8 text-text-primary text-[0.925rem] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              1. Who we are
            </h2>
            <p>
              Cabbie Training provides accredited Passenger Assistance Training
              (PAT) for taxi and private hire drivers. Our registered address is
              Cottis House, Locks Hills, South Street, Rochford, Essex, SS4 1BB.
            </p>
            <p className="mt-2">
              For any data protection queries, contact us at{" "}
              <a
                href="mailto:info@cabbietraining.co.uk"
                className="text-accent-blue hover:underline"
              >
                info@cabbietraining.co.uk
              </a>{" "}
              or call 07739 320050.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              2. What data we collect
            </h2>
            <p>We collect the following personal data:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-muted">
              <li>
                <strong className="text-text-primary">Booking form:</strong>{" "}
                first name, last name, email address, phone number, licensing
                council, and any optional notes you provide.
              </li>
              <li>
                <strong className="text-text-primary">Contact form:</strong>{" "}
                name, email address, phone number (optional), subject, and
                message.
              </li>
              <li>
                <strong className="text-text-primary">Payment data:</strong>{" "}
                processed securely by Stripe. We do not store your card details
                on our servers.
              </li>
              <li>
                <strong className="text-text-primary">
                  Technical data:
                </strong>{" "}
                cookies strictly necessary for the operation of our website (see
                our{" "}
                <Link
                  href="/cookie-policy"
                  className="text-accent-blue hover:underline"
                >
                  Cookie Policy
                </Link>
                ).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              3. Lawful basis for processing
            </h2>
            <p>Under UK GDPR, we rely on the following lawful bases:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-muted">
              <li>
                <strong className="text-text-primary">
                  Contract (Article 6(1)(b)):
                </strong>{" "}
                processing your booking and delivering the training course you
                have paid for.
              </li>
              <li>
                <strong className="text-text-primary">
                  Consent (Article 6(1)(a)):
                </strong>{" "}
                when you submit a contact enquiry or voluntarily provide
                optional information.
              </li>
              <li>
                <strong className="text-text-primary">
                  Legitimate interest (Article 6(1)(f)):
                </strong>{" "}
                responding to your enquiries and improving our services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              4. How we use your data
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li>To process and manage your course booking</li>
              <li>To take payment via Stripe</li>
              <li>To send you booking confirmations and course information</li>
              <li>To respond to your contact enquiries</li>
              <li>To issue your PAT certificate</li>
              <li>
                To comply with legal obligations (e.g. financial record-keeping)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              5. Who we share your data with
            </h2>
            <p>
              We only share your personal data with the following third parties,
              all of whom are bound by data processing agreements:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-muted">
              <li>
                <strong className="text-text-primary">Stripe</strong> — payment
                processing (
                <a
                  href="https://stripe.com/gb/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline"
                >
                  Stripe Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-text-primary">Brevo (Sendinblue)</strong>{" "}
                — transactional email notifications (
                <a
                  href="https://www.brevo.com/legal/privacypolicy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline"
                >
                  Brevo Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong className="text-text-primary">MongoDB Atlas</strong> —
                secure cloud database hosting (
                <a
                  href="https://www.mongodb.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline"
                >
                  MongoDB Privacy Policy
                </a>
                )
              </li>
            </ul>
            <p className="mt-2">
              We do not sell your personal data to any third party. We do not
              transfer your data outside the UK/EEA unless the recipient
              provides adequate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              6. How long we keep your data
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-text-muted">
              <li>
                <strong className="text-text-primary">Booking data:</strong>{" "}
                retained for 6 years after the course date to comply with HMRC
                financial record-keeping requirements.
              </li>
              <li>
                <strong className="text-text-primary">Contact enquiries:</strong>{" "}
                retained for 12 months after your last communication, then
                deleted.
              </li>
              <li>
                <strong className="text-text-primary">Payment records:</strong>{" "}
                retained by Stripe in accordance with their retention policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              7. Your rights
            </h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-text-muted">
              <li>
                <strong className="text-text-primary">Access</strong> — request
                a copy of the personal data we hold about you
              </li>
              <li>
                <strong className="text-text-primary">Rectification</strong> —
                ask us to correct inaccurate data
              </li>
              <li>
                <strong className="text-text-primary">Erasure</strong> — ask us
                to delete your data (where we have no legal obligation to retain
                it)
              </li>
              <li>
                <strong className="text-text-primary">
                  Restrict processing
                </strong>{" "}
                — ask us to limit how we use your data
              </li>
              <li>
                <strong className="text-text-primary">Data portability</strong>{" "}
                — request your data in a machine-readable format
              </li>
              <li>
                <strong className="text-text-primary">Object</strong> — object
                to processing based on legitimate interest
              </li>
              <li>
                <strong className="text-text-primary">Withdraw consent</strong>{" "}
                — where processing is based on consent, you may withdraw it at
                any time
              </li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:info@cabbietraining.co.uk"
                className="text-accent-blue hover:underline"
              >
                info@cabbietraining.co.uk
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              8. Data security
            </h2>
            <p>
              We take appropriate technical and organisational measures to
              protect your personal data, including encrypted connections
              (HTTPS), secure cloud hosting, and hashed admin credentials. No
              method of transmission over the internet is 100% secure, but we
              strive to use commercially acceptable means to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              9. Cookies
            </h2>
            <p>
              Our website uses strictly necessary cookies to enable core
              functionality such as authentication. For full details, see our{" "}
              <Link
                href="/cookie-policy"
                className="text-accent-blue hover:underline"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              10. Complaints
            </h2>
            <p>
              If you are unhappy with how we handle your personal data, you have
              the right to lodge a complaint with the Information
              Commissioner&apos;s Office (ICO):
            </p>
            <p className="mt-2 text-text-muted">
              Information Commissioner&apos;s Office
              <br />
              Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
              <br />
              <a
                href="https://ico.org.uk/make-a-complaint/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                ico.org.uk/make-a-complaint
              </a>
              <br />
              Helpline: 0303 123 1113
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              11. Changes to this policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Any changes
              will be posted on this page with an updated &quot;last
              updated&quot; date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
