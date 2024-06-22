import { AppleSignIn } from "@/components/apple-sign-in";
import { ConsentBanner } from "@/components/consent-banner";
import { DesktopCommandMenuSignIn } from "@/components/desktop-command-menu-sign-in";
import { GithubSignIn } from "@/components/github-sign-in";
import { GoogleSignIn } from "@/components/google-sign-in";
import { OTPSignIn } from "@/components/otp-sign-in";
import { SlackSignIn } from "@/components/slack-sign-in";
import { Cookies } from "@/utils/constants";
import { getCountryCode, isEUCountry } from "@midday/location";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@midday/ui/accordion";
import { Icons } from "@midday/ui/icons";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { userAgent } from "next/server";

export const metadata: Metadata = {
  title: "Login | Solomon AI",
};

export default async function Page(params) {
  if (params?.searchParams?.return_to === "desktop/command") {
    return <DesktopCommandMenuSignIn />;
  }

  const countryCode = getCountryCode();
  const isEU = isEUCountry(countryCode);
  const cookieStore = cookies();
  const preferred = cookieStore.get(Cookies.PreferredSignInProvider);
  const showTrackingConsent = isEU && !cookieStore.has(Cookies.TrackingConsent);
  const { device } = userAgent({ headers: headers() });

  let moreSignInOptions: React.ReactNode | null = null;

  let preferredSignInOption =
    device?.vendor === "Apple" ? (
      <div className="flex flex-col space-y-2">
        <GoogleSignIn />
        {/* <AppleSignIn /> */}
      </div>
    ) : (
      <GoogleSignIn />
    );

  switch (preferred?.value) {
    // case "apple":
    //   preferredSignInOption = <AppleSignIn />;
    //   moreSignInOptions = (
    //     <>
    //       <GoogleSignIn />
    //       <SlackSignIn />
    //       <GithubSignIn />
    //       <OTPSignIn className="border-t-[1px] border-border pt-8" />
    //     </>
    //   );
    //   break;

    case "slack":
      preferredSignInOption = <SlackSignIn />;
      moreSignInOptions = (
        <>
          <GoogleSignIn />
          /* `<AppleSignIn />` is a component that likely provides a button or interface for users to
          sign in using their Apple ID. It is part of the login options available on the page for
          users to choose from when logging in to the Solomon AI platform. */
          {/* <AppleSignIn /> */}
          <GithubSignIn />
          <OTPSignIn className="border-t-[1px] border-border pt-8" />
        </>
      );
      break;

    case "github":
      preferredSignInOption = <GithubSignIn />;
      moreSignInOptions = (
        <>
          <GoogleSignIn />
          {/* <AppleSignIn /> */}
          <SlackSignIn />
          <OTPSignIn className="border-t-[1px] border-border pt-8" />
        </>
      );
      break;

    case "google":
      preferredSignInOption = <GoogleSignIn />;
      moreSignInOptions = (
        <>
          {/* <AppleSignIn /> */}
          <GithubSignIn />
          <SlackSignIn />
          <OTPSignIn className="border-t-[1px] border-border pt-8" />
        </>
      );
      break;

    case "otp":
      preferredSignInOption = <OTPSignIn />;
      moreSignInOptions = (
        <>
          <GoogleSignIn />
          {/* <AppleSignIn /> */}
          <GithubSignIn />
          <SlackSignIn />
        </>
      );
      break;

    default:
      if (device?.vendor === "Apple") {
        moreSignInOptions = (
          <>
            <SlackSignIn />
            <GithubSignIn />
            <OTPSignIn className="border-t-[1px] border-border pt-8" />
          </>
        );
      } else {
        moreSignInOptions = (
          <>
            {/* <AppleSignIn /> */}
            <SlackSignIn />
            <GithubSignIn />
            <OTPSignIn className="border-t-[1px] border-border pt-8" />
          </>
        );
      }
  }

  return (
    <div>
      <header className="w-full fixed left-0 right-0">
        <div className="ml-5 mt-4 md:ml-10 md:mt-10">
          <Link href="https://solomon-ai.app">
            <Icons.Logo />
          </Link>
        </div>
      </header>

      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
          <div className="flex w-full flex-col relative">
            <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-[#848484] to-[#000] inline-block text-transparent bg-clip-text">
              <h1 className="font-medium pb-1 text-3xl">Solomon AI</h1>
            </div>

            <p className="font-medium pb-1 text-2xl text-[#878787]">
              Proactive stress testing, <br /> for your practice.
            </p>

            {/** this is the form to migrate */}
            <AuthenticationForm
              preferredAuthenticationMethod={preferred?.value as string}
              deviceVendor={device?.vendor as string}
            />

            <p className="text-xs text-[#878787]">
              By clicking continue, you acknowledge that you have read and agree
              to Solomon AI's{" "}
              <a href="https://solomon-ai.app/terms" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://solomon-ai.app/policy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
}
interface AuthenticationFormProps {
  preferredAuthenticationMethod: string;
  deviceVendor: string;
}

const AuthenticationForm: React.FC<AuthenticationFormProps> = ({
  preferredAuthenticationMethod,
  deviceVendor
}) => {

  const renderPreferredSignInOption = () => {
    switch (preferredAuthenticationMethod) {
      case "slack":
        return <SlackSignIn />;
      case "github":
        return <GithubSignIn />;
      case "otp":
        return <OTPSignIn />;
      case "google":
      default:
        return deviceVendor === "Apple" ? (
          <div className="flex flex-col space-y-2">
            <GoogleSignIn />
          </div>
        ) : (
          <GoogleSignIn />
        );
    }
  };

  const renderMoreSignInOptions = () => {
    switch (preferredAuthenticationMethod) {
      case "slack":
        return (
          <>
            <GoogleSignIn />
            <AppleSignIn />
            <GithubSignIn />
            <OTPSignIn className="border-t-[1px] border-border pt-8" />
          </>
        );
      case "github":
        return (
          <>
            <GoogleSignIn />
            <SlackSignIn />
            <OTPSignIn className="border-t-[1px] border-border pt-8" />
          </>
        );
      case "google":
        return (
          <>
            <GithubSignIn />
            <SlackSignIn />
            <OTPSignIn className="border-t-[1px] border-border pt-8" />
          </>
        );
      case "otp":
        return (
          <>
            <GoogleSignIn />
            <GithubSignIn />
            <SlackSignIn />
          </>
        );
      default:
        return (
          <>
            <SlackSignIn />
            <GithubSignIn />
            <OTPSignIn className="border-t-[1px] border-border pt-8" />
          </>
        );
    }
  };

  return (
    <div className="pointer-events-auto mt-6 flex flex-col mb-6">
      {renderPreferredSignInOption()}
      <Accordion
        type="single"
        collapsible
        className="border-t-[1px] pt-2 mt-6"
      >
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="justify-center space-x-2 flex text-sm">
            <span>More options</span>
          </AccordionTrigger>
          <AccordionContent className="mt-4">
            <div className="flex flex-col space-y-4">
              {renderMoreSignInOptions()}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const TermsAndPrivacyPolicy = () => {
  return (
    <p className="text-xs text-[#878787]">
      By clicking continue, you acknowledge that you have read and agree
      to Solomon AI's{" "}
      <a href="https://solomon-ai.app/terms" className="underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="https://solomon-ai.app/policy" className="underline">
        Privacy Policy
      </a>
      .
    </p>
  );
}