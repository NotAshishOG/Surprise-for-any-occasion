import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen relative pt-12 px-6">
      <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 rounded-2xl relative z-10 font-sans">
        <Link href="/" className="inline-block mb-6 font-bold font-sans hover:-translate-x-1 hover:text-[#EF476F] transition-all absolute top-8 left-8">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-handwriting mb-8 text-center border-b-4 border-black pb-4">Terms of Service</h1>
        
        <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-black mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">2. Description of Service</h2>
            <p>
              Our website provides a platform for users to create, customize, and share digital surprise cards. 
              The service is provided &quot;as is&quot; and we reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">3. User Conduct and Content</h2>
            <p className="mb-4">When using our service, you agree that you will NOT create or share content that is:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Illegal, threatening, abusive, harassing, defamatory, deceptive, or fraudulent.</li>
              <li>Infringing on any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
              <li>Containing unauthorized or unsolicited advertising, junk or bulk email (spam).</li>
              <li>Containing software viruses or any other computer codes, files, or programs that are designed to disrupt, damage, or limit the functioning of any software, hardware, or telecommunications equipment.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to remove any content or cards that violate these terms, at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">4. Intellectual Property</h2>
            <p>
              The original design, layout, graphics, and source code of this website are the property of Chatmi AI and its creators. 
              You may not reproduce, duplicate, copy, sell, resell or exploit any portion of the service without express written permission from us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">5. Disclaimer of Warranties</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. 
              We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall Chatmi AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at: <br/>
              <a href="mailto:supportchatmiai@gmail.com" className="font-bold text-[#EF476F] hover:underline">supportchatmiai@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
