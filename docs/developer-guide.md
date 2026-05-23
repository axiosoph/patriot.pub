# Pueblo Patriot Local Developer Guide

Welcome to the development environment for the **Pueblo Patriot** independent newspaper. This document outlines onboarding steps, database seeding procedures, admin portal setup, and common troubleshooting workflows.

---

## 1. Quick Start

Ensure you have [Nix](https://nixos.org/) installed on your machine.

1. **Enter the Nix Shell**:
   This loads Node 22, MySQL 8, Mailpit, and `process-compose` without polluting your global environment:
   ```bash
   nix-shell
   ```

2. **Spin Up the Services**:
   This runs the bootstrap initializer (if not already completed) and starts MySQL, Ghost CMS, and Mailpit:
   ```bash
   just up
   ```

3. **Access the Portals**:
   - **Frontend Site**: [http://localhost:2368](http://localhost:2368)
   - **Ghost Admin Dashboard**: [http://localhost:2368/ghost](http://localhost:2368/ghost)
   - **Mailpit Web Mailbox**: [http://localhost:8025](http://localhost:8025)

4. **Gracefully Shutdown**:
   ```bash
   just down
   ```

---

## 2. Setting Up the Ghost Admin Account

On a fresh environment bootstrap, Ghost requires a one-time administrator setup:

1. Start your environment (`just up`).
2. Navigate to [http://localhost:2368/ghost](http://localhost:2368/ghost) in your browser.
3. You will see a **"Create your account"** screen.
4. Input your local details (e.g., name, email, and password). This creates the primary owner user of your local blog.
5. Once submitted, you will be redirected to the Ghost Admin panel.

---

## 3. Database Seeding

We provide a seeding tool to populate your local database with realistic, Pueblo-centric articles spanning Politics, Business, Transit, Culture, and Nonprofit beats, including public and member-gated articles.

### Automating the Seed:
From inside the `nix-shell`, run:
```bash
just seed
```

> [!IMPORTANT]
> **Clear Caches**: Ghost heavily caches database records, routing maps, and settings. If you run the seed command while Ghost is running, **you must restart the services** for the new articles to appear on the homepage.
> ```bash
> just down && just up
> ```

---

## 4. SMTP / Email Interception

For features like newsletter sign-ups, password resets, and magic login links, Ghost attempts to dispatch emails. 

1. **Interception**: In the development configuration, all outgoing SMTP traffic is directed to Mailpit on `127.0.0.1:1025`.
2. **Reviewing Mail**: Open [http://localhost:8025](http://localhost:8025) in your web browser. You will see a local email inbox capturing all sent notifications, allowing you to click verification links and test registration flows without hitting real email servers.

---

## 5. Directory Structure & Theme Syncing

The codebase splits the Ghost application logic from our custom presentation styling:

- `ghost-app/`: Untracked directory containing the Ghost CMS engine. Modifying files here is discouraged.
- `themes/pueblo-patriot/`: Tracked custom theme directory. 
- **Symlinking**: The bootstrap script creates a symlink mapping `themes/pueblo-patriot/` directly into `ghost-app/content/themes/pueblo-patriot`. Ghost will hot-reload CSS and Handlebars templates on change when running in development mode.

---

## 6. Troubleshooting & SRE Guidelines

### Orphaned `mysqld` Processes
If you cancel `process-compose` forcefully (e.g., using `kill -9` or via terminal crashes), the background `mysqld` child process might remain active, holding a lock on the database socket.
- **Symptom**: Next time you run `just up`, MySQL fails to start due to port/socket binds.
- **Resolution**: Kill the orphaned process manually:
  ```bash
  killall -9 mysqld
  ```

### Database Hard Reset
If you wish to wipe the local database and Ghost content folders to perform a clean reinstall:
```bash
just clean
```
Then start fresh with:
```bash
just bootstrap
```

---

## 7. Automated Testing & Verification

We provide automated E2E integration tests to ensure that templates, registration handlers, SMTP interception, and gated member access remain correct.

### Running Automated E2E Tests:
Ensure your environment is running (`just up`), then execute:
```bash
just test
```
This script:
1. Validates that anonymous visitors are blocked by the paywall on members-only posts.
2. Dispatches a magic login link request via Ghost's native members API.
3. Accesses the local Mailpit REST API to extract the magic link token.
4. Requests the magic link to authenticate the user session.
5. Captures session cookies and verifies they grant full access to gated articles, bypassing the paywall overlay.

### Testing Stripe Paid Subscriptions Locally:
Ghost utilizes Stripe checkout events for paid tiers. To test this flow locally:

1. **Configure Credentials Automatically**: Set your Stripe test keys in your shell:
   ```bash
   export STRIPE_PUBLISHABLE_KEY="pk_test_..."
   export STRIPE_SECRET_KEY="sk_test_..."
   export STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
   Then run the database injector script to configure Ghost:
   ```bash
   just configure-stripe
   ```
   *Note: Restart your environment (`just down && just up`) for Ghost to load these settings from the database.*

2. **Authenticate with Stripe CLI**: Log in to your Stripe account using the pre-installed Stripe CLI inside the Nix shell:
   ```bash
   stripe login
   ```

3. **Listen for Webhooks**: Run the webhook forwarder to pipe billing events directly to your local database:
   ```bash
   just stripe-listen
   ```

4. **Run Automated Billing E2E Tests**: If you have populated `STRIPE_SECRET_KEY` and also specify a target Stripe test price ID:
   ```bash
   export STRIPE_TEST_PRICE_ID="price_..."
   just test
   ```
   This will execute the automated checkout, confirm the payment intent programmatically via Stripe's API with a test card method, await the webhook sync, and verify that paid gated articles are instantly unlocked.

