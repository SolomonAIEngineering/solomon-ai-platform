export type Providers = "teller" | "plaid" | "gocardless";

export type ProviderParams = {
  provider: Providers;
  environment?: "development" | "staging" | "production";
};

export type Transaction = {
  amount: number;
  currency: string;
  date: string;
  internal_id: string;
  bank_account_id: string;
  team_id: string;
  status: "posted" | "pending";
  balance?: string | null;
  category?: string | null;
  method: string;
  name: string;
  description?: string | null;
  currency_rate?: number | null;
  currency_source?: string | null;
  assigned_id?: string | null;
  category_slug?: string | null;
  manual?: boolean | null;
  account_id: string | null;
  account_owner?: string | null;
  iso_currency_code?: string | null;
  unofficial_currency_code?: string | null;
  category_id?: string | null;
  authorized_date?: Date | null;
  authorized_datetime?: Date | null;
  location_address?: string | null;
  location_city?: string | null;
  location_region?: string | null;
  location_postal_code?: string | null;
  location_country?: string | null;
  location_lat?: number | null;
  location_lon?: number | null;
  location_store_number?: string | null;
  merchant_name?: string | null;
  merchant_entity_id?: string | null;
  logo_url?: string | null;
  website?: string | null;
  payment_meta_by_order_of?: string | null;
  payment_meta_payer?: string | null;
  payment_meta_payee?: string | null;
  payment_meta_payment_method?: string | null;
  payment_meta_payment_processor?: string | null;
  payment_meta_ppd_id?: string | null;
  payment_meta_reason?: string | null;
  payment_meta_reference_number?: string | null;
  payment_channel?: string | null;
  pending?: boolean | null;
  pending_transaction_id?: string | null;
  personal_finance_category_primary?: string | null;
  personal_finance_category_detailed?: string | null;
  personal_finance_category_confidence_level?: string | null;
  personal_finance_category_icon_url?: string | null;
  transaction_id?: string | null;
  transaction_code?: string | null;
  transaction_type?: string | null;
  check_number?: string | null;
};

export type Institution = {
  id: string;
  name: string;
  logo?: string | null;
};

export type Account = {
  id: string;
  name: string;
  currency: string;
  provider: Providers;
  institution?: Institution;
  enrollment_id?: string; // Teller
};

export type Balance = {
  amount: number;
  currency: string;
};

export type GetTransactionsRequest = {
  teamId: string;
  bankAccountId: string;
  accountId: string;
  latest?: boolean;
  accessToken?: string; // Teller & Plaid
};

export type GetAccountsRequest = {
  id?: string; // GoCardLess
  countryCode?: string; // GoCardLess
  accessToken?: string; // Teller & Plaid
  institutionId?: string; // Plaid
};

export type GetAccountBalanceRequest = {
  accountId: string;
  accessToken?: string; // Teller & Plaid
};

export type GetTransactionsResponse = Transaction[];

export type GetAccountsResponse = Account[];
