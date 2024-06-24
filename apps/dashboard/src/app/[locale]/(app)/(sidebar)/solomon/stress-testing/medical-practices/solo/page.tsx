import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import AnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Solo Practice Stress Testing | Solomon AI",
};

export default function SoloPracticeStressTesting() {
    return (
        <EmptyStatePane title={"Solo Practice Stress Testing"}>
            <p className="text-sm text-[#878787]">
                Solo Practice Stress Testing
            </p>
        </EmptyStatePane>
    );
}
