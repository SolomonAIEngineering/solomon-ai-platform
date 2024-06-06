import { CopyInput } from "@/components/copy-input";
import { Keyboard } from "@/components/keyboard";
import { Button } from "@midday/ui/button";
import type { Metadata } from "next";
import Image from "next/image";
import appIcon from "public/app-icon.png";

export const metadata: Metadata = {
  title: "Download",
};

export default function Page() {
  return (
    <div className="container flex flex-col items-center mb-12 md:mb-48 text-center">
      <h1 className="mt-24 font-medium text-center text-5xl mb-24">
        Always at your fingertips.
      </h1>

      <Keyboard />

      <Image
        src={appIcon}
        alt="Solomon AI App"
        width={120}
        height={120}
        quality={100}
        className="w-[80px] h-[80px] mt-12 md:mt-0 md:h-auto md:w-auto"
      />
      <p className="mb-4 text-2xl	font-medium mt-8">Solomon AI for Mac</p>
      <p className="text-[#878787] font-sm max-w-[500px]">
        With Solomon AI on Mac you have everything <br />
        accessible just one click away.
      </p>

      <a href="https://go.solomon-ai.app/d" download>
        <Button
          variant="outline"
          className="border border-primary h-12 px-6 mt-8"
        >
          Download
        </Button>
      </a>

      <p className="text-xs text-[#878787] mt-4">
        Supports apple silicon & intel
      </p>

      <CopyInput
        value="curl -sL https://go.solomon-ai.app/d | tar -xz"
        className="max-w-[410px] mt-8 font-mono font-normal"
      />
    </div>
  );
}
