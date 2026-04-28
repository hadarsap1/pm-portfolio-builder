"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface TypewriterProps {
  text: string;
  /** ms per character. Default 28. */
  speed?: number;
  /** ms before typing starts. Default 350. */
  startDelay?: number;
  className?: string;
}

/**
 * Type the tagline out character-by-character on mount. The single most
 * "this is alive" cue we can give in the hero — a static tagline reads
 * like template; one that types itself reads like a person speaking.
 *
 * Uses Array.from so emoji and Hebrew compose properly as code points
 * (a naive `text.length` would split surrogate pairs).
 */
export default function Typewriter({
  text,
  speed = 28,
  startDelay = 350,
  className,
}: TypewriterProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const codepoints = React.useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(reduced ? codepoints.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(codepoints.length);
      return;
    }
    setCount(0);
    let i = 0;
    const startTimer = window.setTimeout(function tick() {
      i++;
      setCount(i);
      if (i < codepoints.length) {
        window.setTimeout(tick, speed);
      }
    }, startDelay);
    return () => window.clearTimeout(startTimer);
  }, [codepoints, speed, startDelay, reduced]);

  const visible = codepoints.slice(0, count).join("");
  const done = count >= codepoints.length;

  return (
    <span className={className}>
      {visible}
      {/* Blinking caret while typing; vanishes once finished */}
      {!done && !reduced && (
        <span
          aria-hidden
          className="inline-block w-[2px] h-[0.9em] ms-0.5 align-middle bg-current animate-pulse"
        />
      )}
    </span>
  );
}
