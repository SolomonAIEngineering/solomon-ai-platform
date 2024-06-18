import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";

import React from "react";
import { TripleColumn } from "responsive-react-email";

type Props = {
  baseUrl?: string;
  unsubscribeLink?: string;
};

export function Footer({ baseUrl, unsubscribeLink }: Props) {
  return (
    <Section className="w-full">
      <Hr />

      <br />

      <Text className="text-[21px] font-regular">
        Proactive Stress Testing For Your Practice.
      </Text>

      <br />

      <TripleColumn
        pX={0}
        pY={0}
        styles={{ textAlign: "left" }}
        columnOneContent={
          <Section className="text-left p-0 m-0">
            <Row>
              <Text className="font-medium">Product</Text>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app"
              >
                Homepage
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/pricing"
              >
                Pricing
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/story"
              >
                Story
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/updates"
              >
                Updates
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/download"
              >
                Download
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/feature-request"
              >
                Feature Request
              </Link>
            </Row>
          </Section>
        }
        columnOneStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
        columnTwoContent={
          <Section className="text-left p-0 m-0">
            <Row>
              <Text className="font-medium">Terms</Text>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/terms"
              >
                Terms of service
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.app/policy"
              >
                Privacy policy
              </Link>
            </Row>
          </Section>
        }
        columnTwoStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
        columnThreeContent={
          <Section className="text-left p-0 m-0">
            <Row>
              <Text className="font-medium">Resources</Text>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://solomon-ai.notion.site/999bf0b14a4449a2a91fb0ce8c3c9e5e?v=7485a25a52214a1db111b550d4c18097&pvs=74"
              >
                Roadmap
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://github.com/SolomonAIEngineering/solomon-ai-platform"
              >
                Github
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://app.solomon-ai.app/account/support"
              >
                Support
              </Link>
            </Row>
          </Section>
        }
        columnThreeStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
      />

      <br />
      <br />
      <br />
      <br />

      <Row>
        <Text className="text-[#B8B8B8] text-xs">
          Solomon AI
        </Text>
      </Row>

      {unsubscribeLink && (
        <Row>
          <Link
            className="text-[#707070] text-[14px]"
            href={unsubscribeLink}
            title="Unsubscribe"
          >
            Unsubscribe
          </Link>
        </Row>
      )}

      {!unsubscribeLink && (
        <Row>
          <Link
            className="text-[#707070] text-[14px]"
            href="https://app.solomon-ai.app/settings/notifications"
            title="Unsubscribe"
          >
            Notification preferences
          </Link>
        </Row>
      )}

      <br />
      <br />

      <Row>
        <Link href="https://solomon-ai.app">
          <Img
            src={`${baseUrl}/logo-footer.png`}
            width="100"
            alt="Solomon AI"
            className="block"
          />
        </Link>
      </Row>
    </Section>
  );
}
