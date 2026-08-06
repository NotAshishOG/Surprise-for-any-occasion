import Link from "next/link";
import { FloatingElements } from "@/components/ui/FloatingElements";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 z-[0] opacity-50 dot-pattern pointer-events-none" />
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <FloatingElements />
      </div>

      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-[4px] border-black text-center">
        
        {/* Playful Error Icon/Emote */}
        <div className="text-6xl md:text-8xl mb-6">
          🫣
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-sans text-[#1A1A1A] mb-4">
          Oops! Nothing here.
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-gray-600 mb-8 leading-relaxed">
          It looks like this surprise card doesn't exist, or the link might be broken. 
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full text-lg py-4">
              Create a Surprise 🎁
            </Button>
          </Link>
          <Link href="/support" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full text-lg py-4">
              Get Help
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
