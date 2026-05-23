#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

echo "=== [SRE] Commencing Local Environment Bootstrapping ==="

# 1. Establish project-local directory paths
MYSQL_HOME="$PWD/.nix-data/mysql"
MYSQL_DATADIR="$MYSQL_HOME/data"
MYSQL_UNIX_PORT="$MYSQL_HOME/mysql.sock"
MYSQL_PID_FILE="$MYSQL_HOME/mysql.pid"
MYSQL_TCP_PORT=3306
MYSQL_HOST="127.0.0.1"

# 2. Verify that dependencies are available in path
for cmd in node npm mysqld mysql mysqladmin; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: Required binary '$cmd' not found in PATH."
    echo "Please ensure you have loaded the Nix environment (nix-shell)."
    exit 1
  fi
done

# 3. Initialize MySQL if the data directory is absent
if [ ! -d "$MYSQL_DATADIR" ]; then
  echo "Initializing MySQL 8.0 data directory..."
  mkdir -p "$MYSQL_DATADIR"
  
  # Resolve base package path from binary location dynamically
  MYSQL_BASE="$(dirname "$(dirname "$(which mysqld)")")"
  
  mysqld --initialize-insecure \
    --datadir="$MYSQL_DATADIR" \
    --basedir="$MYSQL_BASE"
  echo "MySQL initialized successfully (root user has no password)."
else
  echo "MySQL data directory already exists. Skipping initialization."
fi

# 4. Start local MySQL in background to allow schema and tables configuration
echo "Starting MySQL temporarily for bootstrapping..."
mysqld --datadir="$MYSQL_DATADIR" \
       --socket="$MYSQL_UNIX_PORT" \
       --port="$MYSQL_TCP_PORT" \
       --bind-address="$MYSQL_HOST" &
MYSQL_TEMP_PID=$!

# Ensure we shut down MySQL even if the bootstrap script crashes
trap 'echo "Cleaning up background MySQL server..."; kill $MYSQL_TEMP_PID 2>/dev/null || true; wait $MYSQL_TEMP_PID 2>/dev/null || true' EXIT

# Wait for MySQL to become ready to accept connections
echo "Waiting for MySQL to accept socket traffic..."
for i in {1..30}; do
  if mysqladmin --socket="$MYSQL_UNIX_PORT" -u root ping &>/dev/null; then
    echo "MySQL is online and responding."
    break
  fi
  sleep 1
done

if ! mysqladmin --socket="$MYSQL_UNIX_PORT" -u root ping &>/dev/null; then
  echo "Error: MySQL failed to start in a reasonable timeframe."
  exit 1
fi

# 5. Create database for Ghost CMS
echo "Creating development database 'patriot_dev' if absent..."
mysql --socket="$MYSQL_UNIX_PORT" -u root -e "CREATE DATABASE IF NOT EXISTS patriot_dev;"

# 6. Install Ghost CMS into ghost-app folder if not already installed
if [ ! -f "ghost-app/config.development.json" ]; then
  echo "Installing Ghost CMS locally (non-interactive)..."
  mkdir -p ghost-app
  
  # Execute installation using the local npm-global Ghost CLI binary
  # We specify version 5.x, using SQLite-compatible options but pointing to MySQL
  ghost install local \
    --dir ghost-app \
    --db mysql \
    --dbhost 127.0.0.1 \
    --dbname patriot_dev \
    --dbuser root \
    --dbpass "" \
    --url "http://localhost:2368" \
    --port 2368 \
    --no-prompt \
    --no-stack \
    --no-setup-ssl \
    --no-setup-nginx \
    --no-start
  
  echo "Running database migrations..."
  (cd ghost-app && NODE_ENV=development ./current/node_modules/.bin/knex-migrator init --mgpath ./current)
else
  echo "Ghost CMS already installed. Skipping installation."
fi

# Disable ActivityPub (social_web) setting in database to prevent local bootstrap deadlocks
echo "Disabling ActivityPub (social_web) setting in database..."
mysql --socket="$MYSQL_UNIX_PORT" -u root -e "USE patriot_dev; UPDATE settings SET value = 'false' WHERE \`key\` = 'social_web';"

# Set the active theme to pueblo-patriot
echo "Setting active theme to 'pueblo-patriot' in database..."
mysql --socket="$MYSQL_UNIX_PORT" -u root -e "USE patriot_dev; UPDATE settings SET value = 'pueblo-patriot' WHERE \`key\` = 'active_theme';"

# Configure primary editorial navigation beats
echo "Configuring primary editorial navigation beats in settings..."
mysql --socket="$MYSQL_UNIX_PORT" -u root -e "USE patriot_dev; UPDATE settings SET value = '[{\"label\":\"Politics\",\"url\":\"/tag/politics/\"},{\"label\":\"Business\",\"url\":\"/tag/business/\"},{\"label\":\"Community\",\"url\":\"/tag/community/\"},{\"label\":\"Culture\",\"url\":\"/tag/culture/\"}]' WHERE \`key\` = 'navigation';"

# 7. Configure Ghost mail options to intercept via Mailpit
echo "Configuring Ghost SMTP routing to Mailpit..."
node -e '
const fs = require("fs");
const path = "ghost-app/config.development.json";
if (fs.existsSync(path)) {
  const config = JSON.parse(fs.readFileSync(path, "utf8"));
  config.mail = {
    transport: "SMTP",
    options: {
      host: "127.0.0.1",
      port: 1025
    }
  };
  fs.writeFileSync(path, JSON.stringify(config, null, 2));
  console.log("Configured config.development.json mail parameters successfully.");
} else {
  console.error("Warning: config.development.json not found!");
}
'

# 8. Symlink custom theme into Ghost themes directory
echo "Registering custom theme 'pueblo-patriot' inside Ghost content path..."
mkdir -p themes/pueblo-patriot
mkdir -p ghost-app/content/themes
rm -rf ghost-app/content/themes/pueblo-patriot
ln -sf ../../../themes/pueblo-patriot ghost-app/content/themes/pueblo-patriot

echo "=== [SRE] Bootstrapping Complete. Ready to start services! ==="
