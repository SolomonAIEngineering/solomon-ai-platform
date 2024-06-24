import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import AnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Location Analytics | Solomon AI",
};

export default function LocationAnalytics() {
    const images: Array<ImageType> = [
        {
            id: 1,
            src: AnalyticsImage,
            src2: AnalyticsImage
        }
    ];

    return (
        <EmptyStatePane images={images} title={"Financial Analytics (Location)"}>
            <p className="text-sm text-[#878787]">
                Soon we’ll be releasing our financial analytics feature offering,<br />
                which provides location level insights sourced directly<br />
                from your transactions.
            </p>
        </EmptyStatePane>
    );
}
