import { useEffect, useRef, useState } from "react";

type Callback = (entry: IntersectionObserverEntry) => void;

// One observer shared by every revealed element keeps scroll work minimal.
const callbacks = new WeakMap<Element, Callback>();
let observer: IntersectionObserver | undefined;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => entries.forEach((entry) => callbacks.get(entry.target)?.(entry)),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  return observer;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has entered the viewport (never resets). */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = getObserver();
    callbacks.set(el, (entry) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      io.unobserve(el);
      callbacks.delete(el);
    });
    io.observe(el);
    return () => {
      io.unobserve(el);
      callbacks.delete(el);
    };
  }, [inView]);

  return { ref, inView };
}
