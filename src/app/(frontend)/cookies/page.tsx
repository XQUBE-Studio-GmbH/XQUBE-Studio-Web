import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for XQUBE Studio GmbH — what cookies we use and how to manage them.',
  robots: { index: false, follow: false },
}

export default function CookiePolicyPage() {
  return (
    <section className="xq-section">
      <div className="xq-container">
        <div className="max-w-3xl">
          <div className="xq-label mb-4">Legal</div>
          <h1 className="text-4xl font-black text-white mb-4">Cookie Policy</h1>
          <p className="text-xq-muted text-sm mb-12">Last updated: January 2025</p>

          <div className="space-y-10">

            <div>
              <h2 className="text-xl font-bold text-white mb-3">What are cookies?</h2>
              <p className="text-xq-muted leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They allow the website to remember your preferences and understand how you interact with the site.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Cookies we use</h2>
              <p className="text-xq-muted leading-relaxed mb-4">
                This website uses only analytics cookies, and only after you provide your consent via the cookie banner.
              </p>
              <div className="xq-card overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="border-b border-xq-border">
                      <th className="text-left text-white font-semibold pb-3 pr-4">Cookie</th>
                      <th className="text-left text-white font-semibold pb-3 pr-4">Provider</th>
                      <th className="text-left text-white font-semibold pb-3 pr-4">Purpose</th>
                      <th className="text-left text-white font-semibold pb-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-xq-muted">
                    <tr className="border-b border-xq-border">
                      <td className="py-3 pr-4">_ga</td>
                      <td className="py-3 pr-4">Google Analytics</td>
                      <td className="py-3 pr-4">Distinguishes users</td>
                      <td className="py-3">2 years</td>
                    </tr>
                    <tr className="border-b border-xq-border">
                      <td className="py-3 pr-4">_ga_*</td>
                      <td className="py-3 pr-4">Google Analytics</td>
                      <td className="py-3 pr-4">Persists session state</td>
                      <td className="py-3">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">xq-cookie-consent</td>
                      <td className="py-3 pr-4">XQUBE Studio</td>
                      <td className="py-3 pr-4">Stores your cookie preference</td>
                      <td className="py-3">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Managing cookies</h2>
              <p className="text-xq-muted leading-relaxed mb-4">
                You can withdraw your consent at any time by clearing your browser cookies or adjusting your browser settings. You can also manage cookies directly in your browser:
              </p>
              <ul className="text-xq-muted space-y-2 list-none">
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Chrome: Settings → Privacy and security → Cookies and other site data</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                <li className="flex gap-2"><span className="text-xq-accent">→</span> Safari: Preferences → Privacy → Manage Website Data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Questions</h2>
              <p className="text-xq-muted leading-relaxed">
                If you have questions about our use of cookies, contact us at{' '}
                <a href="mailto:info@xqubestudio.com" className="text-xq-accent hover:underline">info@xqubestudio.com</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
