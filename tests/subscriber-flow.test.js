const test = require('node:test');
const assert = require('node:assert');

const GHOST_URL = 'http://localhost:2368';
const MAILPIT_URL = 'http://localhost:8025';

test('Subscriber Flow Integration', async (t) => {
  const email = `automated-test-${Date.now()}@example.com`;

  // 1. Verify Gated Post is restricted for anonymous visitors
  await t.test('Gated article paywall active for anonymous users', async () => {
    const res = await fetch(`${GHOST_URL}/echoes-of-steel-evraz-pueblos-modern-working-class/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('paywall-gate'), 'Page must contain paywall gating block');
    assert.ok(!html.includes('great-grandfather worked the blast furnaces'), 'Page must not reveal premium text');
  });

  // 2. Submit Subscribe form
  await t.test('Submit email to magic link API', async () => {
    const res = await fetch(`${GHOST_URL}/members/api/send-magic-link/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': GHOST_URL,
        'Referer': `${GHOST_URL}/`
      },
      body: JSON.stringify({ email, emailType: 'subscribe' })
    });
    assert.strictEqual(res.status, 201, 'Signup request should return 201 Created');
    const json = await res.json();
    assert.ok(json.inboxLinks, 'Response should contain local email links');
  });

  // 3. Retrieve magic link from Mailpit
  let magicLink = '';
  await t.test('Retrieve email from Mailpit and extract token link', async () => {
    // Wait for the mail dispatcher to process SMTP
    await new Promise(resolve => setTimeout(resolve, 1500));

    const res = await fetch(`${MAILPIT_URL}/api/v1/messages`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    
    // Find the message sent to our test email
    const message = json.messages.find(m => m.To.some(t => t.Address === email));
    assert.ok(message, `Email to ${email} should be intercepted by Mailpit`);

    // Fetch the full message content
    const msgRes = await fetch(`${MAILPIT_URL}/api/v1/message/${message.ID}`);
    const msgData = await msgRes.json();
    
    // Extract url from HTML body
    const linkRegex = /href="([^"]+action=subscribe[^"]+)"/i;
    const match = linkRegex.exec(msgData.HTML);
    assert.ok(match, 'Magic login link must be present in email HTML');
    
    magicLink = match[1].replace(/&amp;/g, '&'); // Clean HTML entity encoding
  });

  // 4. Authenticate via Magic Link
  let cookies = [];
  await t.test('Request magic link to authenticate subscriber session', async () => {
    // Perform request and prevent auto-redirects so we can capture cookies on the initial 302
    const res = await fetch(magicLink, { redirect: 'manual' });
    assert.ok(res.status === 302 || res.status === 200, 'Auth request should redirect or succeed');
    
    cookies = res.headers.getSetCookie();
    assert.ok(cookies.length > 0, 'Response should return set-cookie headers');
    assert.ok(cookies.some(c => c.includes('ghost-members-ssr')), 'Cookies must include member session token');
  });

  // 5. Access Gated Post with Member Cookies
  await t.test('Member session grants access to gated content', async () => {
    const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
    
    const res = await fetch(`${GHOST_URL}/echoes-of-steel-evraz-pueblos-modern-working-class/`, {
      headers: {
        'Cookie': cookieHeader
      }
    });
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(!html.includes('paywall-gate'), 'Gated article should not have paywall overlay for authenticated members');
    assert.ok(html.includes('great-grandfather worked the blast furnaces'), 'Gated article must expose full article text to authenticated members');
  });
});
