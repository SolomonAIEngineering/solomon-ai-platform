import { Img, Section } from "@react-email/components";
import React from "react";

interface LogoProps {
  baseUrl: string;
}

export function Logo({ baseUrl }: LogoProps) {
  return (
    <Section className="mt-[32px]">
      <Img
        src={`${baseUrl}/logo.png`}
        width="45"
        height="45"
        alt="SolomonAI"
        className="my-0 mx-auto block"
      />
    </Section>
  );
}
