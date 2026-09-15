import { useEffect } from "react";

export function useHotkey(keys, handler, { enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;

    let downKey = keys;
    let ctrl = false;

    if (keys.match(/^(ctrl|cmd|mod)\+/)) {
      ctrl = true;
      downKey = keys.split("+").slice(1).join("+");
    }

    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const wantsCtrl = ctrl;
      const ctrlDown = e.ctrlKey || e.metaKey;
      if (ctrlDown === wantsCtrl && key === downKey.toLowerCase()) {
        e.preventDefault();
        handler(e);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [keys, handler, enabled]);
}