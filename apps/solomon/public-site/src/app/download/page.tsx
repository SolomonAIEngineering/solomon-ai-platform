import { CopyInput } from "@/components/copy-input";
import { Keyboard } from "@/components/keyboard";
import { Button } from "@midday/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@midday/ui/card";
import { Input } from "@midday/ui/input";
import { Label } from "@midday/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@midday/ui/tabs";
import type { Metadata } from "next";
import Image from "next/image";
import appIcon from "public/app-icon.png";
import App from '../../../../mobile/app/app';

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
      <AppDownloadSection />
    </div>
  );
}

export function AppDownloadSection() {
  return (
    <Tabs defaultValue="mac" className="w-fit">
      <TabsList className="grid w-full grid-cols-3 rounded-2xl">
        <TabsTrigger value="mac">Mac</TabsTrigger>
        <TabsTrigger value="windows">Windows</TabsTrigger>
        <TabsTrigger value="linux">Linux</TabsTrigger>
      </TabsList>
      <TabsContent value="mac">
        <>
          <AppDownload platform="Mac" link="https://dub.solomon-ai.app/l66aUzF" />
        </>
      </TabsContent>
      <TabsContent value="windows">
        <>
          <AppDownload platform="Windows" link="https://dub.solomon-ai.app/CvbYQHY" />
        </>
      </TabsContent>
      <TabsContent value="linux">
        <>
          <AppDownload platform="Linux" link="https://dub.solomon-ai.app/NNudKB8" />
        </>
      </TabsContent>
    </Tabs>
  )
}

interface AppDownloadProps {
  platform: "Mac" | "Windows" | "Linux";
  link: string;
}

const AppDownload: React.FC<AppDownloadProps> = ({
  platform,
  link
}) => {
  return (
    <>
      <p className="mb-4 text-2xl	font-medium mt-8">Solomon AI for {platform}</p>
      <p className="text-[#878787] font-sm max-w-[500px]">
        With Solomon AI on {platform} you have everything <br />
        accessible just one click away.
      </p>

      <a href={link} download>
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
        value={`curl -sL ${link} | tar -xz`}
        className="max-w-[600px] mt-8 font-mono font-normal rounded-2xl"
      />
    </>
  )
}