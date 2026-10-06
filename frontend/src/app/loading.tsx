import React from "react";
import { Sparkles } from "lucide-react";

export default function StorefrontLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 bg-[#FAF7F2]">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-2 border-[#E8E2D8] border-t-[#0B2D23] animate-spin" />
        <Sparkles className="absolute h-5 w-5 text-[#C5A880] animate-pulse" />
      </div>
      <div className="text-center space-y-0.5">
        <p className="font-serif tracking-[0.25em] text-lg uppercase text-[#0B2D23]">
          LUMIÈRE
        </p>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#9F8259] font-medium">
          FINE JEWELRY
        </p>
      </div>
    </div>
  );
}
