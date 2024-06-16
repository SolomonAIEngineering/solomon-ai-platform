import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story",
};

export default function Page() {
  return (
    <div className="container max-w-[750px]">
      <h1 className="mt-24 font-medium text-center text-5xl mb-16 leading-snug">
        This is why we’re building <br />
        Solomon AI.
      </h1>

      <h3 className="font-medium text-xl mb-2">Problem</h3>
      <p className="text-[#878787] mb-8">
        Solomon AI addresses the problem of financial instability in private medical practices caused by unpredictable external economic factors. These include delays in insurance claims processing, billing inefficiencies, changes in reimbursement rates, and seasonal fluctuations in patient visits.
      </p>

      <h3 className="font-medium text-xl mb-2">Solution</h3>
      <p className="text-[#878787] mb-8">
        Solomon AI employs advanced software tools to conduct financial stress tests and scenario simulations for private medical practices, identifying potential financial vulnerabilities. These tools help practices develop tailored strategies for managing financial risks and improving overall stability in response to external economic challenges.
      </p>

      <h3 className="font-medium text-xl mb-2">Building In Public</h3>
      <p className="text-[#878787] mb-12">
        We've always admired companies that prioritize transparency and collaboration with users to build the best possible product. Whether it's through 15-minute user calls or building in public, these are values we hold dear and will continue to uphold, regardless of how far or big we go.
      </p>

      <div className="mt-6 mb-8">
        <p className="text-sm text-[#878787] mb-2">Best regards,</p>
        <p className="text-sm mb-2">Solomon AI Team</p>
      </div>
    </div>
  );
}
