import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for XQube Studio GmbH — how we collect, use, and protect your personal data in compliance with GDPR.',
  robots: { index: false, follow: false },
}

export default function PrivacyPolicyPage() {
  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="max-w-3xl">
          <div className="xq-label mb-4">Legal</div>
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-xq-muted text-sm mb-12">Last updated: January 2025</p>

          <div className="prose prose-invert max-w-none space-y-10">

            <div>
              <h2 className="text-xl font-bold text-white mb-3">1. Controller</h2>
              <p className="text-xq-muted leading-relaxed">
                XQube Studio GmbH<br />
                Rathausstrasse 21/12, 1010 Vienna, Austria<br />
                Email: info@xqubestudio.com<br />
                Phone: +43 650 5207329
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
              <p className="text-xq-muted leading-relaxed mb-3">We collect the following personal data:</p>
              <ul className="text-xq-muted space-y-2 list-none">
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Contact information (name, email address) submitted via our contact form</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Usage data collected via Google Analytics (anonymised IP addresses, pages visited, time on site)</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Technical data such as browser type and device type (via analytics only)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">3. Purpose and Legal Basis</h2>
              <p className="text-xq-muted leading-relaxed mb-3">We process your data for the following purposes:</p>
              <ul className="text-xq-muted space-y-2 list-none">
                <li className="flex gap-2"><span className="text-xq-accent">→</span> <span><strong className="text-white">Contact form submissions:</strong> To respond to your enquiry. Legal basis: Article 6(1)(b) GDPR — performance of a contract or pre-contractual measures.</span></li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> <span><strong className="text-white">Analytics:</strong> To understand how our website is used and improve it. Legal basis: Article 6(1)(a) GDPR — your consent via the cookie banner.</span></li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">4. Data Retention</h2>
              <p className="text-xq-muted leading-relaxed">
                Contact form data is retained for as long as necessary to respond to your enquiry and up to 3 years for business record-keeping purposes. Analytics data is retained in accordance with Google Analytics default retention settings (14 months). You may request deletion at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">5. Third Parties</h2>
              <p className="text-xq-muted leading-relaxed mb-3">We share data with the following third parties:</p>
              <ul className="text-xq-muted space-y-2 list-none">
                <li className="flex gap-2"><span className="text-xq-accent">→</span> <span><strong className="text-white">Google Analytics:</strong> For website analytics. Google may transfer data to the USA under Standard Contractual Clauses.</span></li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> <span><strong className="text-white">Resend:</strong> For email delivery of contact form notifications. Data is processed in accordance with their Privacy Policy.</span></li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> <span><strong className="text-white">Vercel:</strong> For website hosting. Infrastructure is located in the EU/EEA.</span></li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
              <p className="text-xq-muted leading-relaxed mb-3">Under GDPR, you have the right to:</p>
              <ul className="text-xq-muted space-y-2 list-none">
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Access the personal data we hold about you</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Request correction of inaccurate data</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Request erasure of your data</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Object to or restrict processing</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Withdraw consent at any time (for analytics)</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehörde)</li>
              </ul>
              <p className="text-xq-muted leading-relaxed mt-4">
                To exercise any of these rights, contact us at: <a href="mailto:info@xqubestudio.com" className="text-xq-accent">info@xqubestudio.com</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
              <p className="text-xq-muted leading-relaxed">
                We use cookies solely for analytics purposes via Google Analytics. These are only activated after you provide consent via our cookie banner. See our <a href="/cookies" className="text-xq-accent hover:underline">Cookie Policy</a> for full details.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">8. Changes</h2>
              <p className="text-xq-muted leading-relaxed">
                We may update this Privacy Policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of our website constitutes acceptance of the updated policy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
