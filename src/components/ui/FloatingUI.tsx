"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function FloatingUI() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neon-cyan origin-left z-[100]"
        style={{ scaleX }}
      />
    </>
  );
}
