import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Detects if viewport is smaller than the mobile breakpoint.
 * Fully SSR-safe and hydration-friendly (Next.js ready).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ✅ SSR guard
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    // ✅ Initial value
    setIsMobile(mediaQuery.matches);

    // ✅ Change handler
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // ✅ Cross-browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange); // Safari < 14
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isMobile;
}
