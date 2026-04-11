import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) {
      return;
    }
    const id = hash.replace(/^#/, "");
    if (!id) {
      return;
    }

    let cancelled = false;
    let frames = 0;
    const maxFrames = 90;

    const tick = () => {
      if (cancelled) {
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      frames += 1;
      if (frames >= maxFrames) {
        window.scrollTo(0, 0);
        return;
      }
      requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
