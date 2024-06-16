import Link from "next/link";
import { Card } from "./ui";

export function SectionSubscription() {
  return (
    <div className="min-h-screen relative w-screen">
      <div className="absolute left-4 right-4 md:left-8 md:right-8 top-4 flex justify-between text-lg">
        <span>How we will make money</span>
        <span className="text-[#878787]">
          <Link href="/">Solomon AI </Link>
        </span>
      </div>
      <div className="flex flex-col min-h-screen justify-center container p-[5%]">
        <div className="px-4 md:px-0 md:pt-0 h-[580px] md:h-auto overflow-auto pb-[100px] md:pb-0">
          <div className="mb-4">
            <h2 className="text-2xl">Tiers</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0 md:pt-0 md:mb-[80px] mb-12">
            <Card className="pb-8">
              <span className="py-1 px-4 bg-white text-black rounded-lg text-sm font-medium mb-4">
                Base
              </span>

              <h2 className="text-2xl">$100/mo</h2>
              <p className="text-[#878787] text-sm text-center">
                We will offer a base plan for doctos running single location practices to get to know
                the system and get started with a base set of features.
              </p>
            </Card>

            <Card className="pb-8">
              <span className="py-1 px-4 border border-border rounded-lg text-sm font-medium mb-4">
                Multi-Location Practices
              </span>

              <h2 className="text-2xl">$200/location/mo</h2>
              <p className="text-[#878787] text-sm text-center">
                This tier caters to multi-location practices. They will have access to more in depth features some of which include
                custom financial health assessments, multi-year scenario simulation, practice risk identification, and many more.
              </p>
            </Card>

            <Card className="pb-8">
              <span className="py-1 px-4 border border-border rounded-lg text-sm font-medium mb-4">
                Enterprise
              </span>

              <h2 className="text-2xl">$1500/mo base-fee</h2>
              <p className="text-[#878787] text-sm text-center">
                This plan will be offered to medical groups and hospitals companies with lots of
                seats. This will be licensed based and the price is yet to be
                determined.
              </p>
            </Card>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl">Add ons</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4 md:px-0 md:pt-0">
            <Card className="pb-8">
              <h2 className="font-bold text-xl">Team seats</h2>
              <p className="text-[#878787] text-sm text-center">
                Additional team members will be per seat pricing. The team will
                have the ability to invite how many users they want.
              </p>
            </Card>

            <Card className="pb-8">
              <h2 className="font-bold text-xl">Vault storage</h2>
              <p className="text-[#878787] text-sm text-center">
                A limit will be set to the storage since this is also a moving
                cost for us. Everything above that limit will cost the users
                extra. Price is yet to be determined.
              </p>
            </Card>

            <Card className="pb-8">
              <h2 className="font-bold text-xl">Custom domain</h2>
              <p className="text-[#878787] text-sm text-center">
                If the user want a custom inbox email, for example
                acme.inbox@solomon-ai.app, we can provide this for an additional fee.
              </p>
            </Card>
            <Card className="pb-8">
              <h2 className="font-bold text-xl">Autonomous Agent (Advanced)</h2>
              <p className="text-[#878787] text-sm text-center">
                If teams want their autonomous agent to take actions on their behalf such as alerting
                based on newly found risks, or taking actions to mitigate risks, we can provide this for an additional fee.
              </p>
            </Card>
            <Card className="pb-8">
              <h2 className="font-bold text-xl">Automations</h2>
              <p className="text-[#878787] text-sm text-center">
                Automations such as auto-report generation, auto-risk assessments, and many more will be offered at a fee
              </p>
            </Card>
            <Card className="pb-8">
              <h2 className="font-bold text-xl">AI Knowledge</h2>
              <p className="text-[#878787] text-sm text-center">
                Knowledge bases which a practice's autonomous agent will leverage in driving decision making for the practice will
                incur an additional fee based on the type of integration added to the knowledge base as well as the volume of data added.
              </p>
            </Card>
          </div>

          <div className="px-4 md:px-0">
            <a
              href="https://solomon-ai.app/engine"
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="ful-w p-4 border border-border bg-[#121212] px-6 mt-8 text-center flex flex-col justify-center items-center space-y-4 pb-8">
                <h2 className="font-bold text-xl">Engine</h2>
                <p className="text-[#878787] text-sm text-center max-w-[800px]">
                  Solomon AI Engine streamlines banking integrations with a single
                  API, effortlessly connecting to multiple providers and get one
                  unified format and UI. We currently utilize our Engine
                  internally, but we will soon offer it as a paid service.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
