"use client";

import { useEffect } from "react";

export function AntiTheftWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts (e.g., Ctrl+S, Ctrl+C, Ctrl+Shift+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        // Ctrl+S / Cmd+S
        (e.ctrlKey || e.metaKey) && e.key === 's' ||
        // Ctrl+C / Cmd+C
        (e.ctrlKey || e.metaKey) && e.key === 'c' ||
        // Ctrl+U / Cmd+U (View Source)
        (e.ctrlKey || e.metaKey) && e.key === 'u' ||
        // F12 / DevTools
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <div className="select-none">{children}</div>;
}
