import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import AnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Specialty Care Stress Testing | Solomon AI",
};

export default function SpecialtyCareStressTesting() {
    return (
        <EmptyStatePane title={"Specialty Care Stress Testing"}>
            <p className="text-sm text-[#878787]">
                Specialty Care Stress Testing
            </p>
        </EmptyStatePane>
    );
}
