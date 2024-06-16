-- Schedule the job using pg_cron
SELECT cron.schedule(
  'insert_transactions_to_clickhouse',
  '0 * * * *', -- This cron expression schedules the job to run hourly
  'SELECT insert_new_transactions_to_clickhouse();'
);