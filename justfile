# Pueblo Patriot Developer Tasks

default:
    @just --list

# Initialize local MySQL database and install Ghost CMS
bootstrap:
    @bash bin/bootstrap.sh

# Start MySQL, Mailpit, and Ghost CMS (process-compose)
up:
    @if [ ! -d ".nix-data/mysql/data" ] || [ ! -f "ghost-app/config.development.json" ]; then \
        echo "Environment not initialized. Running bootstrap first..."; \
        bash bin/bootstrap.sh; \
    fi
    process-compose up

# Seed mock articles into the database
seed:
    @node bin/generate-mock-posts.js | mysql --socket=.nix-data/mysql/mysql.sock -u root
    @echo "Seeding complete. Please restart Ghost (just down && just up) to clear cached queries."

# Gracefully stop all background services
down:
    process-compose down || true

# Destroy local database and Ghost app files (Hard Reset)
clean:
    @echo "WARNING: This will destroy your local database and Ghost app installation."
    @read -p "Are you absolutely sure? [y/N] " ans && [ "$ans" = "y" ] || [ "$ans" = "Y" ]
    rm -rf .nix-data/
    rm -rf ghost-app/
    @echo "Clean complete. Run 'just bootstrap' to start over."
