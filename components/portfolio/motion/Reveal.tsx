"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  /** Seconds to wait before this element reveals. Stack with index for stagger. */
  delay?: number;
  /** Pixels to slide up from. Default 16. */
  distance?: number;
  /** Trigger only the first time the element scrolls into view. Default true. */
  once?: boolean;
  className?: string;
}

/**
 * Fade + slide-up on viewport enter. The basic motion primitive used
 * across the public portfolio render. Honors prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 16,
  once = true,
  className,
}: RevealProps): React.JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1], // cubic-bezier "ease-out-expo" — feels editorial, not bouncy
      }}
    >
      {children}
    </motion.div>
  );
}
