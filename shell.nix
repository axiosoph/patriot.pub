{ pkgs ? import <nixpkgs> {} }:

let
  # Pin Node.js to version 22 (LTS) which is required by Ghost 6.x
  node = pkgs.nodejs_22;
in
pkgs.mkShell {
  name = "patriot-pub-env";

  buildInputs = [
    node
    pkgs.mysql80
    pkgs.mailpit
    pkgs.process-compose
    pkgs.python3Packages.setuptools
  ];

  shellHook = ''
    # Isolate global NPM packages to local project directory to avoid polluting host
    export NPM_CONFIG_PREFIX="$PWD/.nix-data/npm-global"
    export PATH="$NPM_CONFIG_PREFIX/bin:$PATH"

    # Define runtime environment variables for MySQL and Ghost
    export MYSQL_HOME="$PWD/.nix-data/mysql"
    export MYSQL_DATADIR="$MYSQL_HOME/data"
    export MYSQL_UNIX_PORT="$MYSQL_HOME/mysql.sock"
    export MYSQL_PID_FILE="$MYSQL_HOME/mysql.pid"
    
    # Custom MySQL configurations
    export MYSQL_TCP_PORT=3306
    export MYSQL_HOST="127.0.0.1"

    # Pre-populate configurations for Ghost database target
    export DB_NAME="patriot_dev"
    export DB_USER="root"
    export DB_PASS=""

    # Automatically install Ghost CLI locally inside NPM prefix if absent
    if [ ! -f "$NPM_CONFIG_PREFIX/bin/ghost" ]; then
      echo "=== [SRE] Initializing Local Node Environment ==="
      echo "Installing Ghost CLI locally to .nix-data/npm-global/bin..."
      npm install -g ghost-cli@latest --no-audit --no-fund --silent
    fi

    # Create alias for running MySQL CLI against local socket
    alias mysql-local="mysql --socket=$MYSQL_UNIX_PORT -u root"

    echo "=========================================================="
    echo "  PUEBLO PATRIOT DEVELOPMENT ENVIRONMENT (NIX SHELL)"
    echo "=========================================================="
    echo "  Available Commands:"
    echo "    make bootstrap - Initialize local DB and install Ghost"
    echo "    make up        - Start MySQL, Mailpit, and Ghost CMS"
    echo "    make down      - Stop all background processes"
    echo "    mysql-local    - Connect directly to the local MySQL"
    echo "=========================================================="
    echo "  Services:"
    echo "    - Ghost CMS:     http://localhost:2368"
    echo "    - Ghost Admin:   http://localhost:2368/ghost"
    echo "    - Mailpit WebUI: http://localhost:8025"
    echo "=========================================================="
  '';
}
