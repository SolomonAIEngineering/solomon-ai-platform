
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: start-docker

start-docker: ## Start Docker Desktop
	@echo "Starting Docker Desktop..."
	@open -a Docker
	@echo "Docker Desktop started."

.PHONY: stop-docker
stop-docker: ## Stop Docker Desktop
	@echo "Stopping Docker Desktop..."
	@pkill Docker
	@echo "Docker Desktop stopped."

.PHONY: docker-status
docker-status: ## Get Docker Desktop status
	@echo "Docker Desktop status:"
	@docker system info
	@echo "Docker Desktop status done."

.PHONY: exportenv
exportenv: ## Export environment variables
	@echo "Exporting environment variables..."
	@dotenv -e .env -- env
	@echo "Environment variables exported."

.PHONY: start-supabase
start-supabase: # Start Supabase
	@echo "Starting Supabase..."
	@supabase start
	@echo "Supabase started."

.PHONY: stop-supabase
stop-supabase: # Stop Supabase
	@echo "Stopping Supabase..."
	@supabase stop
	@echo "Supabase stopped."

.PHONY: stop-and-restart-supabase
stop-and-restart-supabase: # Stop and reset Supabase
	@echo "Stopping And Resetting Supabase..."
	@supabase stop --no-backup
	@echo "Supabase stopped."

.PHONY: supabase-migrate
supabase-migrate: # Migrate Supabase
	@echo "Migrating Supabase..."
	@supabase db reset
	@echo "Supabase migrated."

.PHONY: supabase-diff
supabase-diff: # Diff Supabase
	@echo "Diffing Supabase..."
	@supabase db diff --schema public 
	@echo "Supabase diffed."

.PHONY: supabase-restart
supabase-restart: exportenv ## Restart Supabase
	@echo "Restarting Supabase..."
	@supabase stop
	@supabase start
	@echo "Supabase restarted."


.PHONY: restart-clickhouse
restart-clickhouse: ## Restart ClickHouse
	@echo "Restarting ClickHouse..."
	@docker-compose -f docker-compose.clickhouse.yaml down
	@docker-compose -f docker-compose.clickhouse.yaml up -d
	@echo "ClickHouse restarted."

.PHONY: supabase-dev
supabase-dev: start-docker restart-clickhouse supabase-restart supabase-migrate ## Run Supabase in dev mode
	open http://127.0.0.1:54323