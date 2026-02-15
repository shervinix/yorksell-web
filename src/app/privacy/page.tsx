import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Yorksell",
  description: "Privacy Policy for Yorksell Real Estate Group. How we collect, use, and protect your information.",
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Back to home
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Last updated: February 2025
          </p>

          <div className="mt-10 space-y-8 text-[var(--muted)]">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">1. Introduction</h2>
              <p className="mt-3 leading-relaxed">
                Yorksell Real Estate Group (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website at yorksell.com and related services (the &quot;Site&quot;). By using the Site, you consent to the practices described in this policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">2. Information we collect</h2>
              <p className="mt-3 leading-relaxed">
                We may collect information that you provide directly to us, including:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
                <li>Name, email address, and phone number when you contact us, submit a lead form, request a valuation, or inquire about a listing</li>
                <li>Property details (e.g., address, beds, baths, sq ft) when you request a valuation or list with us</li>
                <li>Search preferences (e.g., budget, areas, timeline) when you use our Buy or Sell forms</li>
                <li>Any other information you choose to include in messages or forms</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                We may also automatically collect certain information when you visit the Site, such as your IP address, browser type, device type, and pages visited. We may use cookies and similar technologies for analytics and to improve the Site.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">3. How we use your information</h2>
              <p className="mt-3 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
                <li>Respond to your inquiries and provide real estate services</li>
                <li>Send you property information, valuations, or marketing communications if you have opted in or have an existing relationship with us</li>
                <li>Improve the Site, listings, and user experience</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">4. Sharing of information</h2>
              <p className="mt-3 leading-relaxed">
                We may share your information with:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
                <li>Our team members and service providers who assist in operating the Site and providing services (e.g., hosting, email)</li>
                <li>Real estate boards, MLS, or other parties as needed to provide listing and transaction services</li>
                <li>Law enforcement or other parties when required by law or to protect our rights</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                We do not sell your personal information to third parties for their marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">5. Data retention and security</h2>
              <p className="mt-3 leading-relaxed">
                We retain your information for as long as necessary to fulfill the purposes described in this policy and to comply with legal and regulatory requirements. We implement reasonable technical and organizational measures to protect your information against unauthorized access, loss, or misuse.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">6. Your choices</h2>
              <p className="mt-3 leading-relaxed">
                You may request access to, correction of, or deletion of your personal information by contacting us. You may also opt out of marketing emails by using the unsubscribe link in our emails or by contacting us. Your browser may allow you to disable or limit certain cookies.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">7. Third-party links</h2>
              <p className="mt-3 leading-relaxed">
                The Site may contain links to third-party websites (e.g., listing feeds, maps). We are not responsible for the privacy practices of those sites. We encourage you to read their privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">8. Children</h2>
              <p className="mt-3 leading-relaxed">
                The Site is not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">9. Changes to this policy</h2>
              <p className="mt-3 leading-relaxed">
                We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will reflect the most recent version. We encourage you to review this page periodically.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">10. Contact us</h2>
              <p className="mt-3 leading-relaxed">
                If you have questions about this Privacy Policy or our practices, please contact us at{" "}
                <a href="mailto:info@yorksell.com" className="font-medium text-[var(--accent)] hover:underline">
                  info@yorksell.com
                </a>{" "}
                or through our <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">Contact</Link> page.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <Link href="/" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
