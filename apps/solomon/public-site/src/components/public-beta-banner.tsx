"use client";

import { cn } from "@midday/ui/cn";
import { Icons } from "@midday/ui/icons";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export function PublicBetaBanner() {
  const [isOpen, setOpen] = useState(false);
  const [showBanner, saveShowBanner] = useLocalStorage(
    "show-public-beta-banner",
    true
  );

  useEffect(() => {
    if (showBanner) {
      setTimeout(() => {
        setOpen(true);
      }, 3000);
    }
  }, [showBanner]);

  if (!isOpen) {
    return null;
  }

  const handleOnClose = () => {
    saveShowBanner(false);
    setOpen(false);
  };

  return (
    <a
      href="https://go.solomon-ai.app/htI3aDs"
      target="_blank"
      rel="noreferrer"
      onClick={handleOnClose}
    >
      <div
        className={cn(
          "fixed z-50 bottom-2 md:bottom-4 right-2 md:right-4 w-[calc(100vw-16px)] max-w-[450px] border border-border p-4 transition-all bg-background h-[88px] group rounded-2xl",
          isOpen && "animate-in slide-in-from-bottom-full flex flex-1 gap-3"
        )}
      >

        <div className="flex justify-between">
          <div className="flex flex-col space-y-0.5 pl-[10px] md:border-border md:border-r-[1px] pr-4">
            <span className="text-sm font-medium">
              Solomon AI v1.1.0
            </span>
            <p className="text-xs text-[#878787]">
              Open to all practices  <br />
              in the northeast
            </p>
          </div>

          <button
            onClick={handleOnClose}
            type="button"
            className="absolute right-1.5 top-1.5 text-[#878787] hidden group-hover:block"
          >
            <Icons.Close />
          </button>
          {/* 
          <div className="hidden md:block mt-1.5">
            <CountdownSmall />
          </div> */}
        </div>
      </div>
    </a>
  );
}
