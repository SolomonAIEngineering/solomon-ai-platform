.PHONY: start-docker

start-docker:
	@echo "Starting Docker Desktop..."
	@open -a Docker
	@echo "Docker Desktop started."

.PHONY: stop-docker
stop-docker:
	@echo "Stopping Docker Desktop..."
	@pkill Docker
	@echo "Docker Desktop stopped."

.PHONY: docker-status
docker-status:
	@echo "Docker Desktop status:"
	@docker system info
	@echo "Docker Desktop status done."

.PHONY: create-migrations-dir
create-supabase-dir:
	@echo "Creating supabase directory if it doesn't exist..."
	@mkdir -p supabase
	@echo "Supabase directory is ready."

.PHONY: copy-migrations
copy-migrations: create-migrations-dir
	@echo "Creating migrations directory if it doesn't exist..."
	@mkdir -p supabase/migrations
	@echo "Copying migration files from ../../packages/supabase/migrations to supabase/migrations..."
	@cp -r ../../packages/supabase/migrations/* supabase/migrations/
	@echo "Migration files copied."

.PHONY: copy-config-file
copy-config-file:
	@echo "Copying config file from ../../packages/supabase/config.toml to supabase/config.toml..."
	@cp ../../packages/supabase/config.toml supabase/config.toml
	@echo "Config file copied."

# Convenience target to run both commands
.PHONY: setup-migrations
setup-migrations: create-migrations-dir copy-migrations copy-config-file

.PHONY: exportenv
exportenv:
	@echo "Exporting environment variables..."
	@dotenv -e ../.env -- env
	@echo "Environment variables exported."

.PHONY: start-supabase
start-supabase:
	@echo "Starting Supabase..."
	@supabase start
	@echo "Supabase started."

.PHONY: stop-supabase
stop-supabase:
	@echo "Stopping Supabase..."
	@supabase stop
	@echo "Supabase stopped."

.PHONY: stop-and-restart-supabase
stop-and-restart-supabase:
	@echo "Stopping And Resetting Supabase..."
	@supabase stop --no-backup
	@echo "Supabase stopped."

.PHONY: supabase-migrate
supabase-migrate:
	@echo "Migrating Supabase..."
	@supabase db reset
	@echo "Supabase migrated."

.PHONY: supabase-diff
supabase-diff:
	@echo "Diffing Supabase..."
	@supabase db diff --schema public 
	@echo "Supabase diffed."

.PHONY: supabase-restart
supabase-restart: exportenv
	@echo "Restarting Supabase..."
	@supabase db reset
	@supabase stop --no-backup
	@supabase start
	@echo "Supabase restarted."

.PHONY: start-database
start-database: start-docker supabase-restart exportenv setup-migrations supabase-migrate
	open http://127.0.0.1:54323/project/default