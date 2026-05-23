const test = require('node:test');
const assert = require('node:assert');

const GHOST_URL = 'http://localhost:2368';

test('Theme Layout & Structural Behavior', async (t) => {

  // 1. Verify Homepage Broadsheet Layout Columns
  await t.test('Homepage broadsheet contains three-column print layout structure', async () => {
    const res = await fetch(`${GHOST_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    
    assert.ok(html.includes('class="homepage-broadsheet"'), 'Homepage must declare broadsheet container');
    assert.ok(html.includes('class="broadsheet-column lead-story-col"'), 'Homepage must contain Lead Story column');
    assert.ok(html.includes('class="broadsheet-column secondary-col"'), 'Homepage must contain County Dispatch column');
    assert.ok(html.includes('class="broadsheet-column civic-sidebar-col"'), 'Homepage must contain Civic Sidebar column');
    assert.ok(html.includes('County Dispatch'), 'Homepage must render County Dispatch section title');
  });

  // 2. Verify Static Page Rendering Logic
  await t.test('Static pages render layout structures without post meta bylines', async () => {
    const res = await fetch(`${GHOST_URL}/about/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    assert.ok(html.includes('class="article-header page-header"'), 'Static pages must carry page header style');
    assert.ok(html.includes('class="page-divider"'), 'Static pages must contain custom page accent dividers');
    
    // Static pages should NOT contain author profiles, dates, or reading times
    assert.ok(!html.includes('class="article-meta"'), 'Static pages must omit byline metadata headers');
    assert.ok(!html.includes('class="article-read-time"'), 'Static pages must omit read times');
    assert.ok(!html.includes('class="paywall-gate"'), 'Static pages must not render paid membership gates');
  });

  // 3. Verify Custom Error Sheet Rendering
  await t.test('Requesting non-existent resources serves custom newsprint 404 page', async () => {
    const res = await fetch(`${GHOST_URL}/nonexistent-url/`);
    assert.strictEqual(res.status, 404);
    const html = await res.text();

    assert.ok(html.includes('class="error-page-container"'), '404 sheet must render error page container');
    assert.ok(html.includes('class="error-card"'), '404 sheet must contain the printed bulletin error card');
    assert.ok(html.includes('class="error-code-kicker"'), '404 sheet must display the bulletin status kicker');
    assert.ok(html.includes('class="error-message-text"'), '404 sheet must print the error explanation');
    assert.ok(html.includes('class="error-divider"'), '404 sheet must display the print-style double divider');
  });

  // 4. Verify HTML5 Accessibility Landmarks and Search Triggers
  await t.test('Site layout provides semantic HTML5 landmarks and accessible search hooks', async () => {
    const res = await fetch(`${GHOST_URL}/`);
    const html = await res.text();

    // Check semantic regions
    assert.ok(html.includes('<header class="site-header">'), 'Layout must specify semantic header landmark');
    assert.ok(html.includes('<nav class="header-nav">'), 'Layout must specify semantic navigation landmark');
    assert.ok(html.includes('<main>'), 'Layout must specify semantic main content landmark');
    assert.ok(html.includes('<footer class="site-footer">'), 'Layout must specify semantic footer landmark');
    assert.ok(html.includes('<aside'), 'Layout must specify semantic aside/sidebar landmark');

    // Check search accessibility attributes
    assert.ok(html.includes('data-ghost-search'), 'Header must contain data-ghost-search hook for native search overlay');
    assert.ok(html.includes('aria-label="Search site"'), 'Search button must carry descriptive aria-label');
  });

  // 5. Verify Script Interactive DOM Hooks
  await t.test('Templates contain necessary DOM ids and classes for client-side JS actions', async () => {
    // Check mobile menu and scroll progress hooks on Homepage
    const homeRes = await fetch(`${GHOST_URL}/`);
    const homeHtml = await homeRes.text();

    assert.ok(homeHtml.includes('class="menu-toggle"'), 'Navbar must carry hamburger menu-toggle button');
    assert.ok(homeHtml.includes('class="scroll-progress"'), 'Document shell must carry scroll-progress tracking bar');

    // Check focus mode hooks on a Post page
    const postRes = await fetch(`${GHOST_URL}/city-council-debates-zoning-laws-historic-mesa-junction/`);
    const postHtml = await postRes.text();

    assert.ok(postHtml.includes('id="focus-toggle"'), 'Post page must contain focus-toggle button element');
    assert.ok(postHtml.includes('id="article-grid-container"'), 'Post page must declare article-grid-container');
    assert.ok(postHtml.includes('class="focus-toggle-btn"'), 'Focus mode button must use focus-toggle-btn styling class');
  });
});
