"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "./ui/Button";

interface UserVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userInfo: { name: string; email: string; phone: string }) => void;
  isSubmitting: boolean;
}

export function UserVerificationModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: UserVerificationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter a valid name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim(), phone });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-[3px] border-black w-full max-w-md relative overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#FFD166] p-4 border-b-[3px] border-black flex items-center justify-between">
              <h3 className="font-bold text-xl text-black flex items-center gap-2">
                <span>🎁</span> Almost there!
              </h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="text-black hover:bg-black/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
              <p className="text-gray-700 font-medium text-sm">
                Before we generate your surprise link, please provide your details. This helps us ensure the security of the cards.
              </p>

              <div>
                <label className="block font-bold text-sm mb-1.5 text-left text-gray-900">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white focus:outline-none focus:ring-0 focus:border-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] transition-all font-sans"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1.5 text-left text-gray-900">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white focus:outline-none focus:ring-0 focus:border-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] transition-all font-sans"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-sm mb-1.5 text-left text-gray-900">Phone Number</label>
                <div className="border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] focus-within:border-blue-500 bg-white">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phone}
                    onChange={setPhone}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 outline-none [&>input]:outline-none [&>input]:w-full [&>input]:ml-2"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-bold bg-red-50 p-2 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full py-3.5 bg-[#34D399] hover:bg-[#10B981] text-black text-lg mt-2"
              >
                {isSubmitting ? "Generating Surprise..." : "Generate Shareable Link →"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
