import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#FFE08A] to-[#FFD36A] pt-16 pb-8 px-5 md:px-10 lg:px-20 text-gray-800 font-inter overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col items-start space-y-6 lg:pr-4">
            <a href="https://chatmi.lovable.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <img 
                src="/chatmi.jpg" 
                alt="Chatmi AI Logo" 
                className="h-12 w-12 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-300" 
              />
              <span className="font-sans font-bold text-3xl tracking-tight text-gray-900 group-hover:text-[#EF476F] transition-colors duration-300">
                CHATMI AI
              </span>
            </a>
            
            <p className="text-gray-600 font-medium leading-relaxed max-w-[300px] text-sm">
              India&apos;s AI Assistant built for speed, creativity, and productivity.
            </p>
            
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 bg-white/40 px-3 py-1.5 rounded-full border border-white/60 shadow-sm backdrop-blur-sm">
              <svg width="18" height="18" viewBox="0 0 512 512" className="drop-shadow-sm flex-shrink-0">
                <rect width="512" height="512" rx="64" fill="#f0f0f0"/>
                <path fill="#ff9933" d="M0 64C0 28.65 28.65 0 64 0h384c35.35 0 64 28.65 64 64v106.67H0z"/>
                <path fill="#138808" d="M0 341.33h512V448c0 35.35-28.65 64-64 64H64c-35.35 0-64-28.65-64-64z"/>
                <circle cx="256" cy="256" r="45" fill="none" stroke="#000080" strokeWidth="8"/>
                <g fill="#000080">
                  <path d="M256 211L258 256L262 256Z" transform="rotate(0 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(15 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(30 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(45 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(60 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(75 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(90 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(105 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(120 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(135 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(150 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(165 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(180 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(195 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(210 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(225 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(240 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(255 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(270 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(285 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(300 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(315 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(330 256 256)"/>
                  <path d="M256 211L258 256L262 256Z" transform="rotate(345 256 256)"/>
                </g>
              </svg>
              Proudly Made in India
            </div>

            <div className="text-sm font-medium pt-2">
              <span className="text-gray-600">Created by </span>
              <a 
                href="https://www.youtube.com/@NotAshishOG" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EF476F] to-[#F78C6B] hover:scale-105 inline-block transition-transform origin-left"
              >
                NotAshishOG
              </a>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
            <div className="flex flex-col space-y-3 text-gray-600 font-medium">
              <Link href="/about" className="hover:text-black transition-colors duration-200 relative group inline-block w-fit">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/privacy" className="hover:text-black transition-colors duration-200 relative group inline-block w-fit">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors duration-200 relative group inline-block w-fit">
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/contact" className="hover:text-black transition-colors duration-200 relative group inline-block w-fit">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/faq" className="hover:text-black transition-colors duration-200 relative group inline-block w-fit">
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/support" className="hover:text-black transition-colors duration-200 relative group inline-block w-fit">
                Support
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Column 3: Contact & Social */}
          <div className="flex flex-col space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
              <a 
                href="mailto:supportchatmiai@gmail.com" 
                className="group flex flex-col p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#EF476F]/10 p-2 rounded-lg text-[#EF476F] group-hover:bg-[#EF476F] group-hover:text-white transition-colors duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-[#EF476F] transition-colors duration-300">
                    Email Support
                  </span>
                </div>
                <span className="text-sm text-gray-600 truncate pl-11">supportchatmiai@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-600 px-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                24/7 Support • Response within 24h
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href="https://discord.gg/UsdefHvkq4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm border border-black/5 hover:bg-[#5865F2] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#5865F2]/20 transition-all duration-300"
                  aria-label="Discord"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
                
                <a 
                  href="https://www.instagram.com/notashishog?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm border border-black/5 hover:bg-gradient-to-tr hover:from-[#fd5949] hover:to-[#d6249f] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#d6249f]/20 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                
                <a 
                  href="https://www.youtube.com/@NotAshishOG" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm border border-black/5 hover:bg-[#FF0000] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#FF0000]/20 transition-all duration-300"
                  aria-label="YouTube"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent my-10"></div>
        
        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500 pb-4">
          <p>© 2026 CHATMI AI. All Rights Reserved.</p>
          
          <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full border border-white/50">
            Made with <span className="text-red-500 animate-pulse">❤️</span> in India
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
            <span className="w-1 h-1 rounded-full bg-gray-300 hidden md:block"></span>
            <span className="hidden md:inline">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
