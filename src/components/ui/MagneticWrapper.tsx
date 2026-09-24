"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Direct DOM manipulation — no setState, no re-render
    if (elRef.current) {
      elRef.current.style.transform = `translate(${middleX * 0.3}px, ${middleY * 0.3}px)`;
    }
  };

  const reset = () => {
    if (elRef.current) {
      elRef.current.style.transform = "translate(0px, 0px)";
      elRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  };

  const onEnter = () => {
    if (elRef.current) {
      elRef.current.style.transition = "transform 0.15s ease-out";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={onEnter}
      className="inline-block"
    >
      <div ref={elRef} style={{ willChange: "transform", transform: "translate(0px, 0px)" }}>
        {children}
      </div>
    </div>
  );
}
