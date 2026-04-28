"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface StaggerProps {
  children: React.ReactNode;
  /** Seconds between each child reveal. Default 0.08. */
  step?: number;
  /** Initial delay before first child. Default 0. */
  delay?: number;
  className?: string;
}

/**
 * Wrap a list of siblings to reveal them one after another. Used for the
 * manifesto items, the "now" rows, and metric cards — anything that
 * benefits from feeling like a sequence rather than a static block.
 */
export default function Stagger({
  children,
  step = 0.08,
  delay = 0,
  className,
}: StaggerProps): React.JSX.Element {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: step, delayChildren: delay },
        },
      }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
