import { CalEmbed } from "@/components/cal-embed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk to us",
};

export default function Page() {
  return (
    <div className="mt-24">
      <CalEmbed calLink="solomonai/15min" />
    </div>
  );
}
