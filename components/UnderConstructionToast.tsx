// components/UnderConstructionToast.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react"; // or any icon library

export default function UnderConstructionToast() {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("under-construction-toast-seen", "true");
  };

  // Optional: auto-hide after 12 seconds
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        const seen =
          localStorage.getItem("under-construction-toast-seen") || false;
        if (!seen) {
          setIsVisible(true);
        }
      }
    }, 100);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4">
      <div
        className="
        relative bg-gray-900/70 backdrop-blur-xl border border-cyan-500/30 
        rounded-xl p-5 shadow-2xl shadow-cyan-500/20 text-gray-200
        animate-in fade-in slide-in-from-bottom-5 duration-700
      "
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="text-2xl">⚡</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Under Construction
            </h3>
            <p className="mt-1.5 text-gray-300 text-sm">
              This site is currently under development. Some features may be
              unavailable or behave unexpectedly.
              <span className="text-cyan-300 font-medium">
                {" "}
                Thanks for your patience!
              </span>
            </p>
          </div>
        </div>

        {/* Optional progress feel */}
        <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full w-3/5 bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
