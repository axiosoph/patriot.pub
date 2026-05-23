.PHONY: help bootstrap up down clean shell shell-run

help:
	@echo "Pueblo Patriot Dev Tools"
	@echo "========================"
	@echo "make shell      - Enter the Nix shell environment"
	@echo "make bootstrap  - Initialize local MySQL and install Ghost CMS"
	@echo "make up         - Start MySQL, Mailpit, and Ghost CMS (process-compose)"
	@echo "make down       - Gracefully stop all background services"
	@echo "make clean      - Destroy local database and Ghost app files (Hard Reset)"

shell:
	nix-shell

bootstrap:
	@bash bin/bootstrap.sh

up:
	@if [ ! -d ".nix-data/mysql/data" ] || [ ! -f "ghost-app/config.development.json" ]; then \
		echo "Environment not initialized. Running bootstrap first..."; \
		bash bin/bootstrap.sh; \
	fi
	process-compose up

down:
	process-compose down || true

clean:
	@echo "WARNING: This will destroy your local database and Ghost app installation."
	@read -p "Are you absolutely sure? [y/N] " ans && [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]
	rm -rf .nix-data/
	rm -rf ghost-app/
	@echo "Clean complete. Run 'make bootstrap' to start over."
