import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Cabbie Training",
  description:
    "Information about the cookies used on the Cabbie Training website.",
};

export default function CookiePolicyPage() {
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
          Cookie Policy
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Last updated: 16 February 2025
        </p>

        <div className="space-y-8 text-text-primary text-[0.925rem] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              1. What are cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device when you visit a
              website. They are widely used to make websites work efficiently and
              to provide information to the site owners.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              2. Cookies we use
            </h2>
            <p>
              Our website uses only <strong>strictly necessary cookies</strong>.
              These are essential for the website to function and cannot be
              switched off. They do not track you for marketing purposes.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-navy-light text-left">
                    <th className="px-4 py-2.5 font-bold text-white border-b border-white/10">
                      Cookie Name
                    </th>
                    <th className="px-4 py-2.5 font-bold text-white border-b border-white/10">
                      Purpose
                    </th>
                    <th className="px-4 py-2.5 font-bold text-white border-b border-white/10">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      next-auth.session-token
                    </td>
                    <td className="px-4 py-2.5">
                      Authenticates admin users who log in to manage the site.
                      Not set for regular visitors.
                    </td>
                    <td className="px-4 py-2.5">Session</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      next-auth.csrf-token
                    </td>
                    <td className="px-4 py-2.5">
                      Protects against cross-site request forgery attacks during
                      admin login.
                    </td>
                    <td className="px-4 py-2.5">Session</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      next-auth.callback-url
                    </td>
                    <td className="px-4 py-2.5">
                      Stores the page to redirect to after admin login.
                    </td>
                    <td className="px-4 py-2.5">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      cookie-consent
                    </td>
                    <td className="px-4 py-2.5">
                      Remembers that you have acknowledged this cookie notice.
                    </td>
                    <td className="px-4 py-2.5">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              3. Third-party cookies
            </h2>
            <p>
              When you proceed to payment, you will be redirected to{" "}
              <strong className="text-white">Stripe</strong> (our payment
              processor). Stripe may set its own cookies on its domain to process
              your payment securely. These cookies are governed by{" "}
              <a
                href="https://stripe.com/gb/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </p>
            <p className="mt-2">
              We do not use any analytics, advertising, or social media tracking
              cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              4. Managing cookies
            </h2>
            <p>
              You can control and delete cookies through your browser settings.
              Removing strictly necessary cookies may affect the functionality of
              the website. For more information on managing cookies, visit{" "}
              <a
                href="https://www.aboutcookies.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                aboutcookies.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              5. More information
            </h2>
            <p>
              For more details about how we handle your personal data, please
              read our{" "}
              <Link
                href="/privacy-policy"
                className="text-accent-blue hover:underline"
              >
                Privacy Policy
              </Link>
              . If you have any questions, contact us at{" "}
              <a
                href="mailto:info@cabbietraining.co.uk"
                className="text-accent-blue hover:underline"
              >
                info@cabbietraining.co.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
