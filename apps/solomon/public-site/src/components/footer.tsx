"use client";

import { Icons } from "@midday/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubStars } from "./github-stars";
import { SocialLinks } from "./social-links";
import { StatusWidget } from "./status-widget";

export function Footer() {
  const pathname = usePathname();

  if (pathname.includes("pitch")) {
    return null;
  }

  return (
    <footer className="border-t-[1px] border-border px-4 md:px-6 pt-10 md:pt-16 bg-[#0C0C0C] overflow-hidden md:max-h-[820px]">
      <div className="container">
        <div className="flex justify-between items-center border-border border-b-[1px] pb-10 md:pb-16 mb-12">
          <Link href="/" className="scale-50 -ml-[52px] md:ml-0 md:scale-100 flex flex-1 gap-1">
            {/* <LogoLarge /> */}
            <Icons.Logo className="text-primary font-bold" />
            <span className="text-primary font-bold text-2xl">Solomon AI</span>
          </Link>

          <span className="font-normal md:text-2xl text-right">
            Proactive Stress Testing
            for Your Practice
          </span>
        </div>

        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:w-6/12 justify-between leading-8">
            <div>
              <span className="font-medium">Product</span>
              <ul>
                <li className="transition-colors text-[#878787]">
                  <Link href="/">Features</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/story">Story</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/updates">Updates</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/download">Download</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/feature-request">Feature Request</Link>
                </li>
              </ul>
            </div>

            <div>
              <span>Resources</span>
              <ul>
                <li className="transition-colors text-[#878787]">
                  <Link href="https://github.com/SolomonAIEngineering/orbitkit">Github</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/support">Support</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/policy">Privacy policy</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/terms">Terms and Conditions</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/open-startup">Open Startup</Link>
                </li>
                <li className="transition-colors text-[#878787]">
                  <Link href="/pitch">Investors</Link>
                </li>
                {/* <li className="transition-colors text-[#878787]">
                  <Link href="/branding">Branding</Link>
                </li> */}
              </ul>
            </div>

            <div>
              <span>Solutions</span>
              <ul>
                <li className="transition-colors text-[#878787]">
                  <Link href="/engine">Solomon AI Engine</Link>
                </li>
                {/* <li className="transition-colors text-[#878787]">
                  <Link href="https://docs.solomon-ai.app/self-hosted">
                    Self hosted
                  </Link>
                </li> */}
                {/* <li className="transition-colors text-[#878787]">
                  <Link href="/">SaaS hosting</Link>
                </li> */}
                <li className="transition-colors text-[#878787]">
                  <Link href="/open-startup">Open startup</Link>
                </li>
                {/* <li className="transition-colors text-[#878787]">
                  <Link href="/oss-friends">OSS friends</Link>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="md:w-6/12 flex mt-8 md:mt-0 md:justify-end">
            <div className="flex justify-between md:items-end flex-col space-y-14">
              <div className="flex items-center">
                <GithubStars />
                <SocialLinks />
              </div>
              <div className="md:mr-0 mr-auto">
                <StatusWidget />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-[#161616] text-[500px] leading-none text-center pointer-events-none">
        SolomonAI
      </h5>
    </footer>
  );
}
