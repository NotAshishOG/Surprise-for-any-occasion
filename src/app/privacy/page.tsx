import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen relative pt-12 px-6">
      <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 rounded-2xl relative z-10 font-sans">
        <Link href="/" className="inline-block mb-6 font-bold font-sans hover:-translate-x-1 hover:text-[#EF476F] transition-all absolute top-8 left-8">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-handwriting mb-8 text-center border-b-4 border-black pb-4">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-black mb-4">1. Introduction</h2>
            <p>
              Welcome to Chatmi AI&apos;s Surprise Card Creator. Your privacy is critically important to us. 
              This Privacy Policy explains how we collect, use, and protect your information when you use our website to create and share digital surprise cards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect information in the following ways when you use our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-bold">Content You Provide:</span> Names, personalized messages, uploaded photos, and music links that you include in your surprise cards.</li>
              <li><span className="font-bold">Usage Data:</span> Basic analytics on how you interact with our website to help us improve the user experience.</li>
              <li><span className="font-bold">Device Information:</span> General information about your browser and device type to ensure our site displays correctly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">The information we collect is used primarily to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate and host your custom digital surprise cards.</li>
              <li>Ensure the functionality and security of the shared card links.</li>
              <li>Improve and optimize our website and user interface.</li>
              <li>Respond to your inquiries if you contact our support team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">4. Data Storage and Security</h2>
            <p>
              Your surprise cards and the media within them are stored securely on our servers. 
              We implement industry-standard security measures to protect your data against unauthorized access. 
              However, please remember that any card link you generate is accessible to anyone who has that specific link. 
              Do not include sensitive personal information in your cards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">5. Third-Party Services</h2>
            <p>
              Our website may utilize third-party services (such as YouTube for embedding music). 
              These third parties have their own privacy policies governing their collection and use of data. 
              We are not responsible for the privacy practices of external sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. 
              By continuing to use our service after changes are made, you agree to the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">7. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at: <br/>
              <a href="mailto:supportchatmiai@gmail.com" className="font-bold text-[#EF476F] hover:underline">supportchatmiai@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
