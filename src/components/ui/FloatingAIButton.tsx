"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Bot } from "lucide-react";

export function FloatingAIButton() {
  const [tooltip, setTooltip] = useState(true);

  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-50 flex flex-col items-start gap-2">
      <AnimatePresenceWrapper show={tooltip}>
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.95 }}
          className="bg-foreground text-background text-xs font-semibold px-3 py-2 rounded-xl rounded-bl-sm shadow-soft-md
                     flex items-center gap-2 max-w-[180px]"
        >
          <Bot className="w-3.5 h-3.5 flex-shrink-0" />
          AI ile arızanı teşhis et!
          <button onClick={() => setTooltip(false)} className="ml-1 opacity-60 hover:opacity-100">
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      </AnimatePresenceWrapper>

      <Link
        href="/tamir#ai"
        id="ai-fab"
        aria-label="AI Arıza Asistanı"
        className="w-14 h-14 bg-foreground text-background rounded-full shadow-soft-xl
                   flex items-center justify-center hover:scale-110 active:scale-95
                   transition-all duration-200 relative"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
      </Link>
    </div>
  );
}

function AnimatePresenceWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  const { AnimatePresence } = require("framer-motion");
  return <AnimatePresence>{show && children}</AnimatePresence>;
}
