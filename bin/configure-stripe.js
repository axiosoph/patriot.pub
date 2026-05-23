#!/usr/bin/env node

const { execSync } = require('child_process');

const pubKey = process.env.STRIPE_PUBLISHABLE_KEY;
const secKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!pubKey || !secKey || !webhookSecret) {
  console.log('----------------------------------------------------------------');
  console.log('  [STripe Connect Config] No Stripe keys in environment.');
  console.log('  Set STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, and STRIPE_WEBHOOK_SECRET');
  console.log('  variables to configure Stripe programmatically.');
  console.log('----------------------------------------------------------------');
  process.exit(0);
}

console.log('=== Configuring Stripe in Ghost Database ===');

function runQuery(sql) {
  const socket = '.nix-data/mysql/mysql.sock';
  const escapedSql = sql.replace(/'/g, "'\\''");
  const command = `mysql --socket=${socket} -u root -e "use patriot_dev; ${escapedSql}"`;
  try {
    execSync(command);
  } catch (err) {
    console.error(`Database query failed: ${err.message}`);
    process.exit(1);
  }
}

// Inject credentials directly into settings
runQuery(`UPDATE settings SET value = '${pubKey}' WHERE \`key\` = 'stripe_publishable_key';`);
runQuery(`UPDATE settings SET value = '${secKey}' WHERE \`key\` = 'stripe_secret_key';`);
runQuery(`UPDATE settings SET value = '${webhookSecret}' WHERE \`key\` = 'members_stripe_webhook_secret';`);

console.log('✔ Direct Stripe credentials successfully injected into database.');
console.log('  Please restart Ghost (just down && just up) for changes to take effect.');
console.log('============================================');
