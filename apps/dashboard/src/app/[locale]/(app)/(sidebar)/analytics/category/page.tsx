import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import CategoryAnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Category Analytics | Solomon AI",
};

export default function CategoryAnalytics() {
    const images: Array<ImageType> = [
        {
            id: 1,
            src: CategoryAnalyticsImage,
            src2: CategoryAnalyticsImage
        }
    ];

    return (
        <EmptyStatePane images={images} title={"Financial Analytics (Category)"}>
            <p className="text-sm text-[#878787]">
                Soon we’ll be releasing our financial analytics feature offering,<br />
                which provides categorical insights sourced directly<br />
                from your transactions.
            </p>
        </EmptyStatePane>
    );
}
