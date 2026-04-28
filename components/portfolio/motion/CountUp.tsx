"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
  /**
   * The display string. May contain digits + non-digits ("$4.2M", "+18%",
   * "47", "99.98%"). We extract the leading number, animate that, and keep
   * everything else as suffix/prefix.
   */
  value: string;
  /** ms over which the number animates in. Default 900. */
  duration?: number;
  className?: string;
}

/**
 * Animated number that counts from 0 to its parsed value when scrolled
 * into view. Falls back to the static string when the value isn't
 * numeric-leading (e.g. "Q1 2024").
 */
export default function CountUp({
  value,
  duration = 900,
  className,
}: CountUpProps): React.JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();

  // Parse "$4.2M" → { prefix: "$", num: 4.2, suffix: "M" }
  const parsed = React.useMemo(() => parseLeadingNumber(value), [value]);

  // If we can't parse a number, or motion is reduced, there's no animation
  // to run — just render the literal value during render. The animation
  // path only handles the parseable + motion-OK + scrolled-into-view case.
  const animatable = !!parsed && !reduced;

  const [display, setDisplay] = useState(
    animatable ? `${parsed!.prefix}0${parsed!.suffix}` : value
  );

  useEffect(() => {
    if (!animatable || !inView) return;

    let raf = 0;
    const start = performance.now();
    const decimals = Math.min(2, (parsed!.num.toString().split(".")[1]?.length ?? 0));

    function step(now: number): void {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // ease-out-cubic — fast start, gentle settle
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed!.num * eased;
      setDisplay(
        `${parsed!.prefix}${current.toFixed(decimals)}${parsed!.suffix}`
      );
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(value); // snap to authoritative string at end
      }
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animatable, inView, parsed, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

interface ParsedNumber {
  prefix: string;
  num: number;
  suffix: string;
}

function parseLeadingNumber(s: string): ParsedNumber | null {
  // Optional sign + digits + optional decimal portion.
  // Captures "$4.2M", "+18%", "47", "-3.1pp", "99.98%"
  const match = s.match(/^([^\d+-]*)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const num = Number(match[2]);
  if (!Number.isFinite(num)) return null;
  return {
    prefix: match[1] ?? "",
    num,
    suffix: match[3] ?? "",
  };
}
