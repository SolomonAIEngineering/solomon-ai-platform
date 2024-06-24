import { EmptyStateInvoice } from "@/components/empty-state-invoice";
import { EmptyStatePane, ImageType } from "@/components/empty-state-pane";
import { Metadata } from "next";
import ExpenseAnalyticsImage from "public/solomon/analytics/analytics.png"

export const metadata: Metadata = {
    title: "Expense Analytics | Solomon AI",
};

export default function ExpenseAnalytics() {
    const images: Array<ImageType> = [
        {
            id: 1,
            src: ExpenseAnalyticsImage,
            src2: ExpenseAnalyticsImage
        }
    ];

    return (
        <EmptyStatePane images={images} title={"Financial Analytics (Expense)"}>
            <p className="text-sm text-[#878787]">
                Soon we’ll be releasing our financial analytics feature offering,<br />
                which provides expense level insights sourced directly<br />
                from your transactions.
            </p>
        </EmptyStatePane>
    );
}
