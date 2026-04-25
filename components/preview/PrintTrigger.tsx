"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** When the page loads with ?print=1, trigger window.print() after hydration. */
export default function PrintTrigger(): null {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("print") === "1") {
      // Short delay to let React finish painting before print dialog opens
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [params]);

  return null;
}
