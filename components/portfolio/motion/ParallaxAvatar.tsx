"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface ParallaxAvatarProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Avatar with subtle scroll-driven Y translate. Maximum -12px to avoid
 * any layout drama; just enough to feel alive when scrolled. Disabled
 * for prefers-reduced-motion.
 */
export default function ParallaxAvatar({
  src,
  alt,
  className,
}: ParallaxAvatarProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [12, -12]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn("inline-block", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover ring-2 ring-zinc-100"
      />
    </motion.div>
  );
}
