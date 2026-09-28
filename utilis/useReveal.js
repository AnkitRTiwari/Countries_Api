import { useEffect, useRef, useState } from "react";

// One shared observer for every revealed element on the page
const callbacks = new WeakMap();
let observer = null;

function observe(el, onVisible) {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
        }),
      // Reveal once the element is a little way above the bottom edge
      { rootMargin: "0px 0px -60px 0px" }
    );
  }
  callbacks.set(el, onVisible);
  observer.observe(el);
  return () => {
    observer.unobserve(el);
    callbacks.delete(el);
  };
}

// Returns [ref, visible] — visible flips to true the first time the element scrolls into view
export default function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    if (visible || !ref.current) return;
    return observe(ref.current, () => setVisible(true));
  }, [visible]);

  return [ref, visible];
}
