import { AI } from "@/actions/ai/chat";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Cookies } from "@/utils/constants";
import { setupAnalytics } from "@midday/events/server";
import { getCountryCode, isEUCountry } from "@midday/location";
import { currencies } from "@midday/location/src/currencies";
import { getUser } from "@solomon/supabase/cached-queries";
import { nanoid } from "ai";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AssistantModal = dynamic(
  () =>
    import("@/components/assistant/assistant-modal").then(
      (mod) => mod.AssistantModal
    ),
  {
    ssr: false,
  }
);

const ConnectGoCardLessModal = dynamic(
  () =>
    import("@/components/modals/connect-gocardless-modal").then(
      (mod) => mod.ConnectGoCardLessModal
    ),
  {
    ssr: false,
  }
);

const ExportStatus = dynamic(
  () => import("@/components/export-status").then((mod) => mod.ExportStatus),
  {
    ssr: false,
  }
);

const SelectBankAccountsModal = dynamic(
  () =>
    import("@/components/modals/select-bank-accounts").then(
      (mod) => mod.SelectBankAccountsModal
    ),
  {
    ssr: false,
  }
);

const ConnectTransactionsModal = dynamic(
  () =>
    import("@/components/modals/connect-transactions-modal").then(
      (mod) => mod.ConnectTransactionsModal
    ),
  {
    ssr: false,
  }
);

const ImportCSVModal = dynamic(
  () =>
    import("@/components/modals/import-csv-modal").then(
      (mod) => mod.ImportCSVModal
    ),
  {
    ssr: false,
  }
);

const HotKeys = dynamic(
  () => import("@/components/hot-keys").then((mod) => mod.HotKeys),
  {
    ssr: false,
  }
);

const uniqueCurrencies = () => {
  const uniqueSet = new Set(Object.values(currencies));
  return [...uniqueSet];
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const countryCode = cookies().has(Cookies.CountryCode)
    ? cookies().get(Cookies.CountryCode)?.value
    : getCountryCode();

  const isEU = isEUCountry(countryCode);

  if (!user?.data?.team) {
    redirect("/teams");
  }

  if (user) {
    await setupAnalytics({ userId: user.data.id });
  }

  return (
    <div className="relative">
      <AI initialAIState={{ user: user.data, messages: [], chatId: nanoid() }}>
        <Sidebar />

        <div className="mx-4 md:ml-[95px] md:mr-10 pb-8">
          <Header />
          {children}
        </div>

        <AssistantModal />
        <ConnectTransactionsModal isEU={isEU} />
        <ConnectGoCardLessModal countryCode={countryCode} />
        <SelectBankAccountsModal countryCode={countryCode} />
        <ImportCSVModal
          currencies={uniqueCurrencies()}
          defaultCurrency={currencies[countryCode]}
        />
        <ExportStatus />
        <HotKeys />
      </AI>
    </div>
  );
}
