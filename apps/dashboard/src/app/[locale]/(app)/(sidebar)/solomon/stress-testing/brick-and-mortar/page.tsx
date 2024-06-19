import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import AnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Brick And Mortar Stress Testing | Solomon AI",
};

export default function BrickAndMortarStressTesting() {
    return (
        <EmptyStatePane title={"Brick And Mortar Stress Testing"}>
            <p className="text-sm text-[#878787]">
                Brick And Mortar Stress Testing
            </p>
        </EmptyStatePane>
    );
}
