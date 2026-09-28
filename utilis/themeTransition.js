import { flushSync } from "react-dom";

// Reveals the new theme as a circle growing out of the clicked button.
// Browsers without the View Transitions API just switch (with a colour fade).
export function switchThemeWithTransition(event, applyTheme) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) {
    applyTheme();
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  // Keyboard "clicks" report 0,0, so fall back to the button's centre
  const x = event.clientX || rect.left + rect.width / 2;
  const y = event.clientY || rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const root = document.documentElement;
  root.classList.add("theme-transition");
  const transition = document.startViewTransition(() => flushSync(applyTheme));

  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {});
  transition.finished
    .catch(() => {})
    .finally(() => root.classList.remove("theme-transition"));
}
