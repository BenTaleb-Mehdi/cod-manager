"use client";

import React, { useMemo } from "react";
import { generateQRCodeMatrix } from "@/lib/qr-generator";

interface QRCodeImageProps {
  value: string;
  size?: number;
  className?: string;
  quietZone?: number;
}

export function QRCodeImage({
  value,
  size = 96,
  className = "",
  quietZone = 2,
}: QRCodeImageProps) {
  const matrix = useMemo(() => {
    try {
      return generateQRCodeMatrix(value);
    } catch (e) {
      console.error("Failed to generate QR Code matrix:", e);
      return [];
    }
  }, [value]);

  if (matrix.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-[10px] text-slate-400 font-mono rounded ${className}`}
        style={{ width: size, height: size }}
      >
        QR
      </div>
    );
  }

  const moduleCount = matrix.length;
  const viewBoxSize = moduleCount + quietZone * 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={`bg-white block ${className}`}
      shapeRendering="crispEdges"
    >
      <rect width="100%" height="100%" fill="#ffffff" />
      <g fill="#000000">
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c + quietZone}
                y={r + quietZone}
                width={1}
                height={1}
              />
            );
          })
        )}
      </g>
    </svg>
  );
}
