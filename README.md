# Pueblo Patriot Local Development Environment

Welcome to the local development environment for the **Pueblo Patriot** local newspaper. This repository contains a reproducible, Nix-driven, containerless development stack that hosts Ghost CMS, MySQL 8.0, and Mailpit (SMTP interception) natively inside an isolated developer shell.

---

## Architecture Overview

Instead of traditional Docker containers, this stack utilizes **Nix** and **Process Compose** to run native binaries isolated inside the workspace directory, ensuring absolute environment parity with production VM/systemd deployments without the CPU and volume mounting overhead of virtualized containers.

- **Nix Shell**: Pinned to system stable/unstable nixpkgs, providing Node.js 22 (LTS), MySQL 8.0, Mailpit, Process Compose, Python setuptools, and `just` command runner.
- **Local State Directory**: All persistent data (MySQL tables, NPM global modules like `ghost-cli`) are isolated inside `.nix-data/` which is ignored by version control.
- **Orchestration**: `process-compose` coordinates service lifecycles, dependencies, readiness probes, and graceful termination.

---

## Directory Layout

- [shell.nix](file:///var/home/nrd/git/github.com/nrdxp/nrd.sh/patriot.pub/shell.nix): The Nix development shell definition and environment exports.
- [justfile](file:///var/home/nrd/git/github.com/nrdxp/nrd.sh/patriot.pub/justfile): Task runner automating services lifecycle.
- [process-compose.yml](file:///var/home/nrd/git/github.com/nrdxp/nrd.sh/patriot.pub/process-compose.yml): Declares service relationships, commands, and health readiness checks.
- [bin/bootstrap.sh](file:///var/home/nrd/git/github.com/nrdxp/nrd.sh/patriot.pub/bin/bootstrap.sh): Bash script orchestrating database initialization and Ghost installation.
- [themes/pueblo-patriot/](file:///var/home/nrd/git/github.com/nrdxp/nrd.sh/patriot.pub/themes/pueblo-patriot/): Custom Vanilla CSS Ghost theme directory.
- `ghost-app/`: Ghost CMS installation directory (generated during bootstrap).

---

## Developer Workflow

### 1. Entering the Development Environment
Before running any commands, you must instantiate and enter the Nix environment. Open a terminal in the root directory and execute:
```bash
nix-shell
```
Upon entering, the shellHook will:
1. Isolate global NPM prefix paths to `.nix-data/npm-global`.
2. Automatically check for and install the latest `ghost-cli` inside the local prefix if it is absent.
3. Configure environment variables mapping MySQL sockets and ports.
4. Define the `mysql-local` CLI alias.

### 2. Service Orchestration

The project uses `just` to automate developer tasks.

#### Auto-Bootstrap on First Start
If you run:
```bash
just up
```
The task runner checks for the presence of the MySQL data folder (`.nix-data/mysql/data`) and the Ghost configuration file (`ghost-app/config.development.json`). If either is missing, it will **automatically execute the bootstrapping routine** first. You do not need to call the bootstrap script manually on a clean checkout.

#### Manual Bootstrap (Wipe & Re-initialize)
To explicitly initialize or perform a clean install, run:
```bash
just bootstrap
```
This executes [bin/bootstrap.sh](file:///var/home/nrd/git/github.com/nrdxp/nrd.sh/patriot.pub/bin/bootstrap.sh) which:
1. Performs raw database directories setup and starts a temporary MySQL server.
2. Initializes the `patriot_dev` database schema and runs initial migrations via `knex-migrator`.
3. Patches the `settings` database table to disable ActivityPub (`social_web = false`) to bypass local handshake loops.
4. Runs the non-interactive installation of Ghost CMS inside `ghost-app/`.
5. Links outbound SMTP traffic to target Mailpit locally on port `1025`.
6. Creates symlinks from the custom theme inside `themes/` to Ghost's template folders.

#### Shutting Down Services
To stop all services gracefully, press `q` in the Process Compose TUI or execute:
```bash
just down
```

#### Hard Wiping the Environment
To destroy all local databases, Ghost application files, and local NPM installations to start fresh:
```bash
just clean
```

---

## Local Service Ports

Once the environment is active, you can access the following services:

| Service | Address | Description |
|---|---|---|
| **Ghost Front Page** | [http://localhost:2368](http://localhost:2368) | View the rendered site utilizing the `pueblo-patriot` custom theme. |
| **Ghost Admin Console** | [http://localhost:2368/ghost](http://localhost:2368/ghost) | Setup the initial administrator account and publish content. |
| **Mailpit WebUI** | [http://localhost:8025](http://localhost:8025) | View intercepted outbound mail (invitations, sign-ups, newsletter tests). |
| **Local MySQL DB** | `mysql-local` | CLI alias to connect directly to the MySQL socket. |

---

## Troubleshooting

### Port Conflicts
If you receive startup errors indicating ports `2368`, `3306`, or `8025` are already in use, verify that no orphaned Node.js, MySQL, or Mailpit instances are running:
```bash
killall -9 node mysqld mailpit process-compose
```

### Resetting Schema or Migration Locks
If Ghost migrations get stuck in a locked state, connect to your database using the CLI and run:
```bash
mysql-local -e "USE patriot_dev; UPDATE migrations_lock SET locked=0 WHERE lock_key='km01';"
```
