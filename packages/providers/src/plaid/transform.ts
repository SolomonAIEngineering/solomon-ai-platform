import { capitalCase } from "change-case";
import type { Transaction, TransactionCode } from "plaid";
import type {
  Account as BaseAccount,
  Balance as BaseBalance,
  Transaction as BaseTransaction,
} from "../types";
import type {
  TransformAccount,
  TransformAccountBalance,
  TransformTransaction,
} from "./types";

export const mapTransactionMethod = (type?: TransactionCode | null) => {
  switch (type) {
    case "bill payment":
      return "payment";
    case "purchase":
      return "card_purchase";
    case "atm":
      return "card_atm";
    case "transfer":
      return "transfer";
    case "interest":
      return "interest";
    case "bank charge":
      return "fee";
    default:
      return "other";
  }
};

export const mapTransactionCategory = (transaction: Transaction) => {
  if (transaction.personal_finance_category?.primary === "INCOME") {
    return "income";
  }

  if (
    transaction.transaction_code === "transfer" ||
    transaction.personal_finance_category?.primary === "TRANSFER_IN" ||
    transaction.personal_finance_category?.primary === "TRANSFER_OUT"
  ) {
    return "transfer";
  }

  // Positive values when money moves out of the account; negative values when money moves in.
  // For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.
  if (transaction?.amount < 0) {
    return "income";
  }

  if (
    transaction.transaction_code === "bank charge" ||
    transaction.personal_finance_category?.primary === "BANK_FEES"
  ) {
    return "fees";
  }

  if (transaction.personal_finance_category?.primary === "FOOD_AND_DRINK") {
    return "meals";
  }

  if (
    transaction.personal_finance_category?.primary === "TRANSPORTATION" ||
    transaction.personal_finance_category?.primary === "TRAVEL"
  ) {
    return "travel";
  }

  if (
    transaction.personal_finance_category?.detailed ===
    "GENERAL_SERVICES_OTHER_GENERAL_SERVICES"
  ) {
    return "software";
  }

  if (
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_GAS_AND_ELECTRICITY" ||
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_SEWAGE_AND_WASTE_MANAGEMENT" ||
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_WATER" ||
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_OTHER_UTILITIES"
  ) {
    return "facilities-expenses";
  }

  if (
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_RENT"
  ) {
    return "rent";
  }

  if (
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_INTERNET_AND_CABLE" ||
    transaction.personal_finance_category?.detailed ===
    "RENT_AND_UTILITIES_TELEPHONE"
  ) {
    return "internet-and-telephone";
  }

  if (transaction.personal_finance_category?.primary === "HOME_IMPROVEMENT") {
    return "office-supplies";
  }

  if (transaction.personal_finance_category?.primary === "ENTERTAINMENT") {
    return "activity";
  }

  return null;
};

const transformToSignedAmount = (amount: number) => {
  // Positive values when money moves out of the account; negative values when money moves in.
  // For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.
  if (amount > 0) {
    return -amount;
  }

  return amount * -1;
};

export const transformTransaction = ({
  transaction,
  teamId,
  bankAccountId,
}: TransformTransaction): BaseTransaction => {
  const method = mapTransactionMethod(transaction?.transaction_code);

  const txn: BaseTransaction = {
    date: transaction.date,
    name: transaction.name,
    description: transaction?.original_description
      ? capitalCase(transaction.original_description)
      : null,
    method,
    internal_id: `${teamId}_${transaction.transaction_id}`,
    amount: transformToSignedAmount(transaction.amount),
    currency: transaction.iso_currency_code ||
      transaction.unofficial_currency_code ||
      "USD",
    bank_account_id: bankAccountId,
    category: mapTransactionCategory(transaction),
    team_id: teamId,
    status: transaction.pending ? "pending" : "posted",
    account_id: transaction.account_id,
    account_owner: transaction.account_owner,
    category_slug: transaction.personal_finance_category?.primary,
    category_id: transaction.category_id,
    manual: false,
    iso_currency_code: transaction.iso_currency_code,
    unofficial_currency_code: transaction.unofficial_currency_code,
    location_address: transaction.location.address,
    location_city: transaction.location.city,
    location_region: transaction.location.region,
    location_postal_code: transaction.location.postal_code,
    location_country: transaction.location.country,
    location_lat: transaction.location.lat,
    location_lon: transaction.location.lon,
    location_store_number: transaction.location.store_number,
    merchant_name: transaction.merchant_name,
    merchant_entity_id: transaction.merchant_entity_id,
    website: transaction.website,
    payment_meta_by_order_of: transaction.payment_meta.by_order_of,
    payment_meta_payer: transaction.payment_meta.payer,
    payment_meta_payee: transaction.payment_meta.payee,
    payment_meta_payment_method: transaction.payment_meta.payment_method,
    payment_meta_payment_processor: transaction.payment_meta.payment_processor,
    payment_meta_ppd_id: transaction.payment_meta.ppd_id,
    payment_meta_reason: transaction.payment_meta.reason,
    payment_meta_reference_number: transaction.payment_meta.reference_number,
    payment_channel: transaction.payment_channel,
    pending: transaction.pending,
    pending_transaction_id: transaction.pending_transaction_id,
    personal_finance_category_primary:
      transaction.personal_finance_category?.primary,
    personal_finance_category_detailed:
      transaction.personal_finance_category?.detailed,
    personal_finance_category_confidence_level:
      transaction.personal_finance_category?.confidence_level,
    personal_finance_category_icon_url:
      transaction.personal_finance_category_icon_url,
    transaction_id: transaction.transaction_id,
    transaction_code: transaction.transaction_code,
    transaction_type: transaction.transaction_type,
    authorized_date: transaction.authorized_date ? new Date(transaction.authorized_date) : null,
    check_number: transaction.check_number,
    balance: transaction.amount.toFixed(2),
  };

  return txn;
};

export const transformAccount = ({
  account_id,
  name,
  institution,
  balances,
}: TransformAccount): BaseAccount => {
  return {
    id: account_id,
    name,
    currency:
      balances.iso_currency_code || balances.unofficial_currency_code || "USD",
    institution,
    provider: "plaid",
  };
};

export const transformAccountBalance = (
  account: TransformAccountBalance
): BaseBalance => ({
  currency:
    account?.balances.iso_currency_code ||
    account?.balances.unofficial_currency_code ||
    "USD",
  amount: account?.balances?.available ?? 0,
});
