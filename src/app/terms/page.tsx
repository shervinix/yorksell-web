import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Yorksell",
  description: "Terms of Service for Yorksell Real Estate Group. Use of our website and services.",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Back to home
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Last updated: February 2025
          </p>

          <div className="mt-10 space-y-8 text-[var(--muted)]">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">1. Acceptance of terms</h2>
              <p className="mt-3 leading-relaxed">
                By accessing or using the website of Yorksell Real Estate Group (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) at yorksell.com (the &quot;Site&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Site.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">2. Services</h2>
              <p className="mt-3 leading-relaxed">
                The Site provides information about our real estate services in the Greater Toronto Area, including property listings, buyer and seller representation, valuations, and contact forms. Use of the Site does not create a client relationship. A client relationship is formed only when we enter into a written agreement (e.g., listing agreement, buyer representation agreement).
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">3. Use of the site</h2>
              <p className="mt-3 leading-relaxed">
                You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the Site. You may not:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
                <li>Use the Site to transmit harmful, offensive, or illegal content</li>
                <li>Attempt to gain unauthorized access to the Site, our systems, or other users&apos; data</li>
                <li>Scrape, copy, or use listing data or content for commercial purposes without our permission</li>
                <li>Impersonate another person or entity</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">4. Listings and content</h2>
              <p className="mt-3 leading-relaxed">
                Listing information on the Site is provided for general informational purposes and may be sourced from third parties (e.g., MLS). We do not guarantee the accuracy, completeness, or timeliness of listing data. Property details, prices, and availability may change without notice. You should verify any information with us or through independent sources before relying on it.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">5. Contact and lead forms</h2>
              <p className="mt-3 leading-relaxed">
                When you submit a form on the Site (e.g., contact, buy, sell, valuation), you consent to us using your information to respond to your inquiry and provide related real estate services. Our use of your personal information is also governed by our <Link href="/privacy" className="font-medium text-[var(--accent)] hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">6. Disclaimers</h2>
              <p className="mt-3 leading-relaxed">
                The Site and its content are provided &quot;as is&quot; without warranties of any kind, express or implied. We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">7. Limitation of liability</h2>
              <p className="mt-3 leading-relaxed">
                To the fullest extent permitted by law, Yorksell Real Estate Group and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or use, arising out of or in connection with your use of the Site or these Terms. Our total liability shall not exceed the amount you paid to us, if any, in the twelve months preceding the claim, or one hundred Canadian dollars (CAD $100), whichever is greater.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">8. Indemnification</h2>
              <p className="mt-3 leading-relaxed">
                You agree to indemnify and hold harmless Yorksell Real Estate Group and its affiliates, officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising out of or related to your use of the Site or your violation of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">9. Changes to terms</h2>
              <p className="mt-3 leading-relaxed">
                We may modify these Terms at any time. The &quot;Last updated&quot; date at the top will reflect the most recent version. Your continued use of the Site after changes are posted constitutes your acceptance of the revised Terms. We encourage you to review this page periodically.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">10. Governing law</h2>
              <p className="mt-3 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles. Any dispute arising from these Terms or the Site shall be subject to the exclusive jurisdiction of the courts of Ontario.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">11. Contact us</h2>
              <p className="mt-3 leading-relaxed">
                If you have questions about these Terms, please contact us at{" "}
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
