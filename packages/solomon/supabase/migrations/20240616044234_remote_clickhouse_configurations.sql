-- Install wrappers extension into our database of choice
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Create the ClickHouse foreign data wrapper
create foreign data wrapper clickhouse_wrapper
  handler click_house_fdw_handler
  validator click_house_fdw_validator;

-- Create the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Save your ClickHouse credential in Vault and retrieve the `key_id`
DO $$
DECLARE
    key_id uuid;
BEGIN
    INSERT INTO vault.secrets (name, secret)
    VALUES (
        'clickhouse',
        'tcp://default:UiTs2nIkl_uL1@lm74y4ewqx.us-central1.gcp.clickhouse.cloud:9440/SolomonAIFinancialAnalytics_Production'
    )
    RETURNING vault.secrets.key_id INTO key_id;

    -- Create the foreign server using the retrieved key_id
    EXECUTE format(
        'CREATE SERVER clickhouse_server
         FOREIGN DATA WRAPPER clickhouse_wrapper
         OPTIONS (
             conn_string_id %L
         )',
        key_id
    );
END $$;

-- Define the suite of postgres foreign tables from the clickhouse downstream table
create foreign table transactions_internal (
    AccountId                       text,
    AccountOwner                    text,
    Amount                          numeric,
    AuthorizedDate                  text,
    AuthorizedDatetime              text,
    CategoryId                      text,
    CheckNumber                     text,
    CurrentDate                     text,
    CurrentDatetime                 text,
    ID                              text,
    IsoCurrencyCode                 text,
    LinkId                          numeric,
    LocationAddress                 text,
    LocationCity                    text,
    LocationCountry                 text,
    LocationLat                     numeric,
    LocationLon                     numeric,
    LocationPostalCode              text,
    LocationRegion                  text,
    LocationStoreNumber             text,
    MerchantName                    text,
    Name                            text,
    PaymentChannel                  text,
    PaymentMetaByOrderOf            text,
    PaymentMetaPayee                text,
    PaymentMetaPayer                text,
    PaymentMetaPaymentMethod        text,
    PaymentMetaPaymentProcessor     text,
    PaymentMetaPpdId                text,
    PaymentMetaReason               text,
    PaymentMetaReferenceNumber      text,
    Pending                         bool,
    PendingTransactionId            text,
    PersonalFinanceCategoryDetailed text,
    PersonalFinanceCategoryPrimary  text,
    Sign                            int8,
    Time                            timestamp,
    TransactionCode                 text,
    TransactionId                   text,
    UnofficialCurrencyCode          text,
    UserId                          text,
    Categories                      text[],
    ProfileType                     text
)
server clickhouse_server
options (
table 'TransactionInternal'
);

create foreign table recurring_transaction_internal (
    AccountId                       text,
    AverageAmount                   text,
    AverageAmountIsoCurrencyCode    text,
    CategoryId                      text,
    Description                     text,
    FirstDate                       text,
    Flow                            text,
    Frequency                       text,
    ID                              text,
    IsActive                        boolean,
    LastAmount                      text,
    LastAmountIsoCurrencyCode       text,
    LastDate                        text,
    LinkId                          numeric,
    MerchantName                    text,
    PersonalFinanceCategoryDetailed text,
    PersonalFinanceCategoryPrimary  text,
    Sign                            int8,
    Status                          text,
    StreamId                        text,
    Time                            timestamp,
    TransactionIds                  text,
    UpdatedTime                     text,
    UserId                          text,
    ProfileType                     text
)
server clickhouse_server
options (
table 'ReOccuringTransactionInternal'
);

create foreign table account_balance_history (
    Time             timestamp,
    AccountId        text,
    IsoCurrencyCode  text,
    Balance          numeric,
    UserId           text,
    Sign             int8,
    Id               text,
    ProfileType      text
)
server clickhouse_server
options (
table 'AccountBalanceHistoryInternal'
);

-- Define a pg_cron job to periodically update the downstream table on each write
CREATE TABLE IF NOT EXISTS cron_job_state (
    job_name TEXT PRIMARY KEY,
    last_processed TIMESTAMPTZ
);

-- Initialize the table with the job name and a default timestamp
INSERT INTO cron_job_state (job_name, last_processed)
VALUES ('insert_transactions_to_clickhouse', '1970-01-01 00:00:00+00')
ON CONFLICT (job_name) DO NOTHING;

CREATE OR REPLACE FUNCTION insert_new_transactions_to_clickhouse() RETURNS void AS $$
DECLARE
    last_processed TIMESTAMPTZ;
BEGIN
    -- Retrieve the last processed timestamp
    SELECT last_processed INTO last_processed
    FROM cron_job_state
    WHERE job_name = 'insert_transactions_to_clickhouse';

    -- Insert new records into the foreign table
    INSERT INTO transactions_internal (
        AccountId,
        AccountOwner,
        Amount,
        AuthorizedDate,
        AuthorizedDatetime,
        CategoryId,
        CheckNumber,
        CurrentDate,
        CurrentDatetime,
        ID,
        IsoCurrencyCode,
        LinkId,
        LocationAddress,
        LocationCity,
        LocationCountry,
        LocationLat,
        LocationLon,
        LocationPostalCode,
        LocationRegion,
        LocationStoreNumber,
        MerchantName,
        Name,
        PaymentChannel,
        PaymentMetaByOrderOf,
        PaymentMetaPayee,
        PaymentMetaPayer,
        PaymentMetaPaymentMethod,
        PaymentMetaPaymentProcessor,
        PaymentMetaPpdId,
        PaymentMetaReason,
        PaymentMetaReferenceNumber,
        Pending,
        PendingTransactionId,
        PersonalFinanceCategoryDetailed,
        PersonalFinanceCategoryPrimary,
        Sign,
        Time,
        TransactionCode,
        TransactionId,
        UnofficialCurrencyCode,
        UserId,
        Categories,
        ProfileType
    )
    SELECT
        account_id,
        account_owner,
        amount,
        authorized_date::text,
        authorized_datetime::text,
        category_id,
        check_number,
        date::text AS current_date,
        datetime::text AS current_datetime,
        gen_random_uuid()::text AS id,
        iso_currency_code,
        NULL::numeric AS link_id, -- Adjust this field as needed
        location_address,
        location_city,
        location_country,
        location_lat,
        location_lon,
        location_postal_code,
        location_region,
        location_store_number,
        merchant_name,
        name,
        payment_channel,
        payment_meta_by_order_of,
        payment_meta_payee,
        payment_meta_payer,
        payment_meta_payment_method,
        payment_meta_payment_processor,
        payment_meta_ppd_id,
        payment_meta_reason,
        payment_meta_reference_number,
        pending,
        pending_transaction_id,
        personal_finance_category_primary,
        personal_finance_category_detailed,
        1 AS sign, -- Assuming 1 for all new records, adjust as needed
        now() AS time, -- Use the current timestamp
        transaction_code,
        transaction_id,
        unofficial_currency_code,
        NULL::text AS user_id, -- Adjust this field as needed
        '{}'::text[] AS categories, -- Assuming an empty array, adjust as needed
        NULL::text AS profile_type -- Adjust this field as needed
    FROM public.transactions
    WHERE inserted_at > last_processed;

    -- Update the last processed timestamp
    UPDATE cron_job_state
    SET last_processed = now()
    WHERE job_name = 'insert_transactions_to_clickhouse';
END;
$$ LANGUAGE plpgsql;

-- Schedule the job using pg_cron
SELECT cron.schedule(
  'insert_transactions_to_clickhouse',
  '0 * * * *', -- This cron expression schedules the job to run hourly
  'CALL insert_new_transactions_to_clickhouse();'
);