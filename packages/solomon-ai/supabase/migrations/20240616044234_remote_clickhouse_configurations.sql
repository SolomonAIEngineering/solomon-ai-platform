-- install wrappers extension into our database of choice
create extension if not exists wrappers with schema extensions;

-- create the clickhouse foreign data wrapper
create foreign data wrapper clickhouse_wrapper
  handler click_house_fdw_handler
  validator click_house_fdw_validator;

create server clickhouse_server
  foreign data wrapper clickhouse_wrapper
  options (
    conn_string 'tcp://default:@localhost:9000/default'
  );