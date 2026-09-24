"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { XRayPhone } from "./XRayPhone";
import { MatrixTerminal } from "./MatrixTerminal";
import { FloatingReviews } from "./FloatingReviews";
import { ServicesBento } from "./ServicesBento";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SceneManager() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scene 1: Hero (0 - 0.2)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Scene 2: X-Ray Phone Module (0.2 - 0.5)
  const xrayOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const xrayScale = useTransform(scrollYProgress, [0.15, 0.25], [0.8, 1]);

  // Scene 3: Matrix Terminal (0.5 - 0.7)
  const matrixOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
  const matrixY = useTransform(scrollYProgress, [0.45, 0.55], [50, 0]);

  // Scene 4: Services Bento Grid (0.7 - 0.85)
  const bentoOpacity = useTransform(scrollYProgress, [0.65, 0.75, 0.82, 0.85], [0, 1, 1, 0]);
  const bentoScale = useTransform(scrollYProgress, [0.65, 0.75], [0.9, 1]);

  // Scene 5: Floating Reviews (0.85 - 1.0)
  const reviewsOpacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);
  const reviewsY = useTransform(scrollYProgress, [0.82, 0.9], [50, 0]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "500vh" }}>
      {/* Sticky Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none">
        
        {/* =========================================
            SCENE 1: HERO
        ========================================= */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          style={{ opacity: heroOpacity, y: heroY, willChange: "transform, opacity" }}
        >
          <div className="pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-100 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">Geleceğin Tamir Servisi</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-6 text-slate-900">
              Teknolojinin <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Apple'ı.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Kırık ekranlardan sıvı temasına, ölü bataryalardan anakart arızalarına. 
              Deneyimi hissetmek için aşağı kaydırın.
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-[30px] h-[50px] rounded-full border-2 border-white/20 flex justify-center p-2 mx-auto"
            >
              <div className="w-1.5 h-1.5 bg-neon-purple rounded-full" />
            </motion.div>
          </div>
        </motion.div>

        {/* =========================================
            SCENE 2: X-RAY PHONE MODULE
        ========================================= */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4 pointer-events-auto"
          style={{ opacity: xrayOpacity, scale: xrayScale, willChange: "transform, opacity" }}
        >
          {/* Sadece görünür olduğunda render etmesini sağlamak performansı artırır ancak useTransform ile opacity kontrol ettiğimiz için pointer-events'i CSS ile yönetmeliyiz. */}
          <div className="w-full h-full flex items-center justify-center" style={{ pointerEvents: "auto" }}>
             <XRayPhone scrollProgress={scrollYProgress} />
          </div>
        </motion.div>

        {/* =========================================
            SCENE 3: MATRIX TERMINAL
        ========================================= */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4 pointer-events-auto"
          style={{ opacity: matrixOpacity, y: matrixY, willChange: "transform, opacity" }}
        >
          <MatrixTerminal />
        </motion.div>

        {/* =========================================
            SCENE 4: SERVICES BENTO
        ========================================= */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center px-4 pointer-events-auto"
          style={{ opacity: bentoOpacity, scale: bentoScale, willChange: "transform, opacity" }}
        >
          <ServicesBento />
        </motion.div>

        {/* =========================================
            SCENE 5: FLOATING REVIEWS
        ========================================= */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-auto"
          style={{ opacity: reviewsOpacity, y: reviewsY, willChange: "transform, opacity" }}
        >
          <FloatingReviews />
          <div className="mt-20">
            <MagneticWrapper>
              <Link href="/tamir" className="btn-premium text-lg px-12 py-5 rounded-[2rem]">
                Cihazını Şimdi Kurtar
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </MagneticWrapper>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
