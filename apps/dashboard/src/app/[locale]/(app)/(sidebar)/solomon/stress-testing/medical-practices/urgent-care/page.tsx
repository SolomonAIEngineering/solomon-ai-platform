import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import AnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Urgent Cate Stress Testing | Solomon AI",
};

export default function UrgentCareStressTesting() {
    return (
        <EmptyStatePane title={"Urgent Cate Stress Testing"}>
            <p className="text-sm text-[#878787]">
                Urgent Cate Stress Testing
            </p>
        </EmptyStatePane>
    );
}
