"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-[#FAF7F2] text-[#0B2D23] px-4 py-3 text-xs font-semibold">
        <Check className="h-4 w-4 text-[#0B2D23]" />
        <span>Merci pour votre inscription à la Maison Lumière !</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-2 pt-1 w-full"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="w-full sm:flex-1 rounded-full bg-[#FAF7F2] text-[#18221D] px-4 py-3 text-xs placeholder:text-[#18221D]/50 focus:outline-none border border-transparent focus:border-[#C5A880]"
      />
      <button
        type="submit"
        className="w-full sm:w-auto rounded-full bg-[#C5A880] hover:bg-[#B38F4D] text-[#0B2D23] px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase shadow-md transition-colors shrink-0 cursor-pointer"
      >
        SUBSCRIBE
      </button>
    </form>
  );
}
