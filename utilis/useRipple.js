import { useEffect } from "react";

// Elements that get a ripple on click (they need position/overflow set in animations.css)
const RIPPLE_TARGETS =
  ".button, .chip, .pagination-btn, .theme-changer, .back-button, .border-chip, .map-open-link, .map-control, .search-clear, .back-to-top";

// One delegated listener adds a material-style ripple to every button-like element
export default function useRipple() {
  useEffect(() => {
    function handlePointerDown(e) {
      if (e.button !== 0) return;
      const target = e.target.closest(RIPPLE_TARGETS);
      if (!target || target.disabled) return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.addEventListener("animationend", () => ripple.remove());
      target.appendChild(ripple);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);
}
