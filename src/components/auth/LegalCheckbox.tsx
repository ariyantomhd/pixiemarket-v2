"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import LegalModal from "@/components/modal/LegalModal";
import clsx from "clsx";

interface LegalCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export default function LegalCheckbox({ checked, onChange, error }: LegalCheckboxProps) {
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 group cursor-pointer">
        {/* Custom Checkbox Design */}
        <div className="relative flex items-center h-5">
          <input
            type="checkbox"
            className="peer hidden"
            id="terms-check"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label
            htmlFor="terms-check"
            className={clsx(
              "w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center cursor-pointer",
              checked 
                ? "bg-teal-500 border-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]" 
                : "bg-white/5 border-white/10 hover:border-white/20",
              error && !checked && "border-red-500/50 bg-red-500/5"
            )}
          >
            <Check 
              size={14} 
              className={clsx("text-slate-950 font-black transition-transform duration-200", checked ? "scale-100" : "scale-0")} 
              strokeWidth={4}
            />
          </label>
        </div>

        {/* Label Text with Links */}
        <label htmlFor="terms-check" className="text-xs font-medium text-slate-400 leading-relaxed cursor-pointer select-none">
          I agree to the{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setModalType("terms"); }}
            className="text-teal-400 hover:text-teal-300 font-bold underline decoration-teal-500/30 underline-offset-2"
          >
            Terms of Service
          </button>
          {" "}and{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setModalType("privacy"); }}
            className="text-orange-400 hover:text-orange-300 font-bold underline decoration-orange-500/30 underline-offset-2"
          >
            Privacy Policy
          </button>
        </label>
      </div>

      {/* Error Message */}
      {error && !checked && (
        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider animate-pulse">
          * You must agree to continue
        </p>
      )}

      {/* Modals Integration */}
      <LegalModal
        isOpen={modalType === "terms"}
        onClose={() => setModalType(null)}
        type="terms"
        title="Terms & Conditions"
      >
        <div className="space-y-4">
          <h3 className="text-white font-bold italic">1. License & Usage</h3>
          <p>Every digital asset on Pixie Market is subject to our standard license. You are permitted to use the assets for personal and commercial projects as specified during checkout.</p>
          <h3 className="text-white font-bold italic">2. Refund Policy</h3>
          <p>Due to the digital nature of our products, all sales are final. Please review the live preview before completing your purchase.</p>
        </div>
      </LegalModal>

      <LegalModal
        isOpen={modalType === "privacy"}
        onClose={() => setModalType(null)}
        type="privacy"
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <h3 className="text-white font-bold italic">Data Security</h3>
          <p>We use industry-standard encryption to protect your transaction and personal data. Your email is only used for asset delivery and account updates.</p>
        </div>
      </LegalModal>
    </div>
  );
}