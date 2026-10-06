"use client";

import React, { useState, useEffect } from "react";
import { Clock, Flame, Users } from "lucide-react";

interface UrgencyTimerProps {
  initialMinutes?: number;
  stockLeft?: number;
  city?: string;
}

export function UrgencyTimer({
  initialMinutes = 43,
  stockLeft = 6,
  city = "Casablanca",
}: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: initialMinutes,
    seconds: 52,
  });

  const [activeViewers, setActiveViewers] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 45, seconds: 0 };
      });
    }, 1000);

    const viewerInterval = setInterval(() => {
      setActiveViewers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(8, Math.min(27, prev + change));
      });
    }, 7000);

    return () => {
      clearInterval(timer);
      clearInterval(viewerInterval);
    };
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] p-3 sm:p-3.5 space-y-2.5 shadow-xs">
      {/* Ligne 1 : Compte à rebours promo */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 font-semibold text-[#0B2D23]">
          <Clock className="h-4 w-4 animate-pulse text-[#C5A880]" />
          <span>Offre privilège se termine dans :</span>
        </div>

        <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-[#0B2D23]">
          <span className="rounded bg-white px-2 py-0.5 border border-[#E8E2D8] shadow-xs">
            {formatNumber(timeLeft.hours)}h
          </span>
          <span>:</span>
          <span className="rounded bg-white px-2 py-0.5 border border-[#E8E2D8] shadow-xs">
            {formatNumber(timeLeft.minutes)}m
          </span>
          <span>:</span>
          <span className="rounded bg-[#0B2D23] text-[#FAF7F2] px-2 py-0.5 shadow-xs animate-pulse">
            {formatNumber(timeLeft.seconds)}s
          </span>
        </div>
      </div>

      {/* Ligne 2 : Stock restant & Acheteurs en direct */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-[#18221D]/70 pt-1.5 border-t border-[#E8E2D8]">
        <div className="flex items-center gap-1.5 text-[#A8875A] font-semibold">
          <Flame className="h-3.5 w-3.5 fill-[#C5A880] text-[#C5A880]" />
          <span>Plus que {stockLeft} pièces disponibles à {city}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#18221D]/60 font-medium">
          <Users className="h-3.5 w-3.5 text-[#0B2D23]" />
          <span>{activeViewers} personnes consultent ce bijou</span>
        </div>
      </div>
    </div>
  );
}
