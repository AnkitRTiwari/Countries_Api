import { useEffect } from "react";

// Single source of truth for the project's name — change it here only
export const APP_NAME = "Wanderlust";
export const APP_TAGLINE = "Where do you want to go?";

// Sets the browser tab title, e.g. "India · Wanderlust"
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} · ${APP_NAME}`
      : `${APP_NAME} — ${APP_TAGLINE}`;
  }, [title]);
}
