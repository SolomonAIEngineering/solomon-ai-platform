"use client";

import Image from "next/image";
import appIcon from "public/appicon.png";
import { useEffect, useRef } from "react";

export function DesktopSignInVerifyCode({ code }) {
  const hasRunned = useRef(false);

  useEffect(() => {
    if (code && !hasRunned.current) {
      window.location.replace(`solomonai://api/auth/callback?code=${code}`);
      hasRunned.current = true;
    }
  }, [code]);

  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center text-center text-sm text-[#606060]">
        <Image
          src={appIcon}
          width={80}
          height={80}
          alt="Solomon AI"
          quality={100}
          className="mb-10"
        />
        <p>Signing in...</p>
        <p className="mb-4">
          If Solomon AI dosen't open in a few seconds,{" "}
          <a
            className="underline"
            href={`solomonai://api/auth/callback?code=${code}`}
          >
            click here
          </a>
          .
        </p>
        <p>You may close this browser tab when done</p>
      </div>
    </div>
  );
}
