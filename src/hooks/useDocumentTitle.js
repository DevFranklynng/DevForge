import { useEffect } from "react";

/**
 * Keeps the browser document title in sync with a route label.
 * Defaults to plain "DevForge" when no title is provided.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · DevForge` : "DevForge";
  }, [title]);
}