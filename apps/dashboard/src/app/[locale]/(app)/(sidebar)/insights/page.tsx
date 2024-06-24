import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import AnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Insights | Solomon AI",
};

export default function Insights() {
    const images: Array<ImageType> = [
        {
            id: 1,
            src: AnalyticsImage,
            src2: AnalyticsImage
        }
    ];

    return (
        <EmptyStatePane images={images} title={"Insights"}>
            <p className="text-sm text-[#878787]">
                Soon we’ll be releasing our insights feature offering,<br />
                which provides actionabale insights <br />
                specifically optimized for your business' use case and needs.
            </p>
        </EmptyStatePane>
    );
}
