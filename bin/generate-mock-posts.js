#!/usr/bin/env node

const crypto = require('crypto');

// Helper to generate a 24-character hexadecimal string similar to Ghost IDs
function makeGhostId() {
  return crypto.randomBytes(12).toString('hex');
}

// Helper to generate UUID v4
function makeUuid() {
  return crypto.randomUUID();
}

// Curated Unsplash images matching the beats and editorial tone
const images = {
  politics: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80', // Municipal building
  business: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=80', // Sourdough baking
  steel: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80', // Steel manufacturing
  transit: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80', // City bus
  farming: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=1000&auto=format&fit=crop&q=80', // Farmers market
  water: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80', // Colorado river
  chiles: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=1000&auto=format&fit=crop&q=80', // Roasting peppers
  coworking: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80', // Coworking space
  sunset: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1000&auto=format&fit=crop&q=80' // Colorado plains sunset
};

// Defined tags and their corresponding IDs
const tags = [
  { id: '6a11dc6cb095a8a6669b73b0', slug: 'politics', name: 'Politics & Gov' },
  { id: '6a11dc6cb095a8a6669b73b1', slug: 'business', name: 'Business & Dev' },
  { id: '6a11dc6cb095a8a6669b73b2', slug: 'community', name: 'Community Affairs' },
  { id: '6a11dc6cb095a8a6669b73b3', slug: 'culture', name: 'Culture & Identity' },
  { id: '6a11dc6cb095a8a6669b73b4', slug: 'nonprofit', name: 'Charitable & Org' }
];

const mockPosts = [
  {
    title: 'City Council Debates New Zoning Laws for Historic Mesa Junction',
    slug: 'city-council-debates-zoning-laws-historic-mesa-junction',
    tag: tags[0], // Politics & Gov
    image: images.politics,
    featured: 1,
    visibility: 'public',
    custom_excerpt: 'A contentious public hearing highlights tensions between neighborhood preservation advocates and commercial developers eyeing Pueblo’s historic core.',
    html: `
      <p>PUEBLO — Tensions flared in City Hall last night as the Pueblo City Council held a marathon public hearing regarding proposed zoning amendments for the historic Mesa Junction district. The amendments, if passed, would relax parking minimums and allow for mixed-use commercial developments along the neighborhood's main thoroughfares.</p>
      <h2>Preservation vs. Expansion</h2>
      <p>Advocates of the plan argue that changing the decades-old zoning codes will revitalize the area, paving the way for boutique retail, coffee shops, and affordable multi-family housing options. "Our city is at a barbell demographic intersection," noted Councilwoman Maria Chavez during opening remarks. "We have young families looking for walkable neighborhoods and retirees wanting to downsize near services. Keeping these rigid 1970s commercial barriers is choking our neighborhood business districts."</p>
      <blockquote>
        "Walkability is the cornerstone of Pueblo’s future. If we cannot adapt our zoning laws, we are forcing local merchants to abandon historic Mesa Junction in favor of highway strip malls."
      </blockquote>
      <p>However, neighborhood preservationists turned out in large numbers to voice concerns. Many worry that introducing high-density developments will destroy the historic fabric of Mesa Junction, which dates back to the late 19th century and boasts some of Pueblo's finest Victorian architecture. Critics also pointed to the potential congestion, arguing that the narrow side streets are ill-suited to accommodate a surge in street parking.</p>
      <h2>The Developer Stake</h2>
      <p>A major catalyst for the debate is a proposed three-story development at the intersection of Abriendo Avenue and Union Street. The plans call for ground-floor retail topped by twelve residential units. Under current zoning, the developers would be required to provide 24 dedicated off-street parking spaces—a physical impossibility given the size of the historic lot. The proposed amendment would reduce this requirement by half for properties in the historic overlay district.</p>
      <p>The City Council postponed a final vote on the bill until next month's session to allow the Planning and Zoning Commission to conduct a detailed traffic flow study. Stay tuned to the Pueblo Patriot for continued updates on this local story.</p>
    `
  },
  {
    title: 'Mesa Junction Bakery Expands Sourdough Production to Meet Local Demand',
    slug: 'mesa-junction-bakery-expands-sourdough-production',
    tag: tags[1], // Business & Dev
    image: images.business,
    featured: 0,
    visibility: 'public',
    custom_excerpt: 'From a humble home kitchen to a neighborhood staple, local bakers invest in stone-deck ovens to feed Pueblo’s growing appetite for artisanal bread.',
    html: `
      <p>PUEBLO — Inside the flour-dusted kitchen of the Mesa Junction Bakery, the air is thick with the rich, tangy aroma of wild yeast. Under the warm glow of task lighting, master baker Clara Vance is shaping hundreds of batards for the morning rush. The bakery, which opened just three years ago, has quickly outgrown its capacity, prompting a major facility expansion this month.</p>
      <h2>Farming the Wild Yeast</h2>
      <p>The centerpiece of the expansion is a brand-new, Italian-imported steam-injected stone deck oven, which will allow the bakery to triple its daily production. "We went from baking 40 loaves a day in a home convection oven to producing over 300," Vance said, wiping flour from her apron. "Pueblo has a deep appreciation for craft and heritage. People want real bread made with simple ingredients: organic flour, water, salt, and time."</p>
      <p>The expansion also means the bakery can hire two additional full-time apprentice bakers from the culinary arts program at CSU Pueblo. This investment in local talent is part of Vance’s broader vision to establish a sourdough culture in southern Colorado, partnering with local agricultural mills to source heirloom grains grown right here in the Arkansas River Valley.</p>
      <h2>Historic Neighborhood Synergy</h2>
      <p>Mesa Junction has seen a steady resurgence of foot traffic as small businesses occupy storefronts that sat vacant for years. The bakery has become an informal community hub where neighborhood organizers, business owners, and residents gather daily. "A neighborhood bakery is more than a place to buy food," Vance remarked. "It is where you run into your neighbors, share a coffee, and build a local economy from the ground up."</p>
    `
  },
  {
    title: 'The Echoes of Steel: How EVRAZ Anchors Pueblo’s Modern Working Class',
    slug: 'echoes-of-steel-evraz-pueblos-modern-working-class',
    tag: tags[3], // Culture & Identity
    image: images.steel,
    featured: 0,
    visibility: 'members',
    custom_excerpt: 'An in-depth look at the multi-generational families operating the electric arc furnace, keeping the spirit of the Steel City alive in the green energy era.',
    html: `
      <p>PUEBLO — The electric arc furnace at the EVRAZ Rocky Mountain Steel mill operates at temperatures exceeding 3,000 degrees Fahrenheit. For over a century, the mill—formerly Colorado Fuel and Iron (CF&I)—has served as the beating industrial heart of Pueblo. Today, despite changes in ownership and shifts toward green steel technology, it remains the ultimate anchor of Pueblo’s working-class identity.</p>
      <h2>A Legacy Forged in Iron</h2>
      <p>For families like the Lujans, the steel mill is a thread that runs through four generations. "My great-grandfather worked the blast furnaces back in the 1920s," says Robert Lujan, currently a shift supervisor in the rod and bar mill. "My dad was here during the big layoffs of the 80s, and now my daughter is working in the safety department. It’s hard work, but it’s honest work, and it built this city."</p>
      <p>In recent years, the mill has undergone a technological revolution. EVRAZ, in partnership with local utility providers, constructed a massive 300-megawatt solar array on adjacent land, making Pueblo home to the first steel mill in North America to be powered primarily by solar energy. The transition has preserved high-paying industrial jobs while significantly reducing the plant’s local carbon footprint.</p>
      <h2>Cultural Identity and the Steel City</h2>
      <p>Pueblo’s cultural fabric is inextricably tied to the mill. The waves of immigration that populated the city—including Italian, Slovenian, Hispanic, and German families—were drawn here by the promise of steel jobs. This melting pot created Pueblo’s unique culinary traditions, neighborhood layouts, and civic resilience. While other industrial cities rusted away, Pueblo adapted, blending its industrial heritage with a commitment to sustainable manufacturing.</p>
    `
  },
  {
    title: 'Pueblo Transit Proposes New Bus Routes Connecting East Side to Downtown Hub',
    slug: 'pueblo-transit-proposes-new-bus-routes',
    tag: tags[2], // Community Affairs
    image: images.transit,
    featured: 0,
    visibility: 'public',
    custom_excerpt: 'Proposed transit modifications aim to address service gaps on the East Side, improving access to employment and grocery centers for transit-dependent residents.',
    html: `
      <p>PUEBLO — In an effort to address long-standing transportation inequities, Pueblo Transit has unveiled a comprehensive proposal to restructure its bus routes on the city’s East Side. The plan introduces two new express routes designed to reduce commute times to the downtown Transit Center and major shopping corridors.</p>
      <h2>Bridging the Transit Gap</h2>
      <p>The East Side neighborhood has historically experienced longer wait times and fewer direct routes compared to other sectors of the city. For residents without access to private vehicles, a trip to the nearest major grocery store can currently take over an hour each way. "Public transit is not just about moving buses; it is about economic mobility," said Transit Director Marcus Reed. "By streamlining these routes, we are giving people back hours of their week."</p>
      <p>The proposed changes include:
        <ul>
          <li><strong>Route 4X (East Side Express):</strong> 15-minute peak frequencies connecting Hudson Avenue directly to the Downtown Terminal.</li>
          <li><strong>Route 12 (Northside Loop Link):</strong> A new connector routing through commercial zones, providing direct access to medical clinics.</li>
          <li><strong>Shelter Upgrades:</strong> Installation of solar-powered lighting and weather enclosures at the ten busiest East Side stops.</li>
        </ul>
      </p>
      <h2>Community Feedback Solicited</h2>
      <p>The transit agency is hosting three public workshops over the next two weeks to gather resident input before final approval. Neighborhood advocates have generally welcomed the plan but are urging the city to expand weekend service hours, which remain limited. The changes, if approved by the City Council, are slated to take effect in early September.</p>
    `
  },
  {
    title: 'Pueblo Food Project Secures State Grant for Urban Farming Initiatives',
    slug: 'pueblo-food-project-secures-state-grant-urban-farming',
    tag: tags[4], // Charitable & Org
    image: images.farming,
    featured: 0,
    visibility: 'public',
    custom_excerpt: 'A local food sovereignty coalition receives funding to expand community gardens, construct greenhouses, and launch educational culinary programs.',
    html: `
      <p>PUEBLO — The Pueblo Food Project, a grassroots coalition working to create a healthier and more equitable local food system, has been awarded a $75,000 grant from the Colorado Department of Agriculture. The funds will be used to expand the city's network of community gardens and build two new year-round greenhouses on the East Side.</p>
      <h2>Cultivating Food Sovereignty</h2>
      <p>The grant will allow the organization to install drip-irrigation systems, purchase organic soil amendments, and provide free seeds and starter plants to local residents. "Access to fresh, nutritious food should not be determined by your zip code," said project coordinator Sarah Jenkins. "By empowering residents to grow their own food, we are building community resilience and tackling food insecurity at its root."</p>
      <p>In addition to physical infrastructure, the project will launch a series of free weekend workshops covering basic gardening techniques, composting, and water-efficient irrigation in Colorado’s semi-arid climate. The organization also plans to partner with local schools to establish educational gardens, introducing children to sustainable agriculture and healthy eating habits early on.</p>
      <h2>Volunteer Engagement Rising</h2>
      <p>Local volunteer response has been overwhelming, with civic groups, student clubs, and neighborhood residents signing up to help construct the new raised beds. "Working in the garden connects you to the earth and your neighbors," said local volunteer Arthur Ramos. "There is a special pride in eating a tomato you grew with your own hands, shared with people on your block."</p>
    `
  },
  {
    title: 'Behind Closed Doors: The County Commission’s Split Vote on Local Water Rights',
    slug: 'county-commission-split-vote-local-water-rights',
    tag: tags[0], // Politics & Gov
    image: images.water,
    featured: 0,
    visibility: 'paid',
    custom_excerpt: 'A controversial decision to transfer agricultural water leases to residential developers sparks intense debate over the future of Pueblo’s historic farmland.',
    html: `
      <p>PUEBLO — In a decision that will shape the agricultural landscape of Pueblo County for decades, the Board of County Commissioners voted 2-1 last night to approve the transfer of agricultural water leases from the Bessemer Ditch to a new residential master-planned community in Pueblo West.</p>
      <h2>The Buy-Up of Farmland Water</h2>
      <p>The decision allows developers of the proposed "Mesa Vista" subdivision to lease up to 450 acre-feet of water annually. Critics argue that transferring water away from the historic Bessemer Ditch—which has irrigated farms in the St. Charles Mesa for over a century—threatens local food security and the livelihoods of multi-generational farming families.</p>
      <p>"Once you dry up this farmland, it never comes back," testified local farmer Joseph DiSanti during a heated public comment period. "We are selling our agricultural heritage for short-term property tax gains. Without water, our soil turns to dust, and our valley lose its heart."</p>
      <blockquote>
        "Pueblo’s farming legacy is finite. We are choosing subdivisions over sustainability, and once the water flows uphill to money, the farms will wither forever."
      </blockquote>
      <h2>Development Interests Defended</h2>
      <p>Commissioners supporting the transfer argued that housing demand is at an all-time high, and without securing reliable water rights, Pueblo West cannot sustain its economic growth. "We need homes for our workforce," asserted Commissioner Dave Martinez. "This lease contains strict conservation clauses, and the developers are paying a premium that will fund county infrastructure projects. We must balance agricultural preservation with economic reality."</p>
      <p>The split vote highlights growing tension across the Front Range as growing municipalities compete with agricultural districts for Colorado's most precious and scarce natural resource.</p>
    `
  },
  {
    title: 'Celebrating the Pueblo Chile: A History of Colorado’s Iconic Crop',
    slug: 'celebrating-pueblo-chile-history-colorado-iconic-crop',
    tag: tags[3], // Culture & Identity
    image: images.chiles,
    featured: 0,
    visibility: 'public',
    custom_excerpt: 'From the unique microclimate of the St. Charles Mesa to the annual autumn festival, we trace the origins of Pueblo’s famous mirasol pepper.',
    html: `
      <p>PUEBLO — Every autumn, a thick, sweet smoke drifts across Pueblo. It is the smell of roasting chiles—specifically, the Pueblo chile, a thick-walled, spicy pepper that has become the definitive symbol of southern Colorado culture and agriculture.</p>
      <h2>The Miracle of the Mirasol</h2>
      <p>The Pueblo chile is a variety of the mirasol pepper, so named because the pods grow pointing upward toward the sun (mirando al sol). Unlike the thinner-skinned chiles grown in Hatch, New Mexico, the Pueblo chile has a thick, meaty flesh that holds up perfectly to intense fire-roasting. This trait is a direct result of Pueblo's unique terroir: intense high-altitude sunlight, cool desert nights, and mineral-rich soils irrigated by the Arkansas River.</p>
      <p>Local farmers on the St. Charles Mesa have spent generations refining the seed stock, selecting for flavor, thick skin, and consistent heat. "Every family has their own secret seed line," explains farmer Dominic Mauro. "My grandfather selected seeds based on flavor and structure, not just yield. That’s why a Pueblo chile has that rich, sweet flavor behind the heat."</p>
      <h2>A Cultural Phenomenon</h2>
      <p>The chile is deeply woven into Pueblo's everyday life. It is the star ingredient of the "Slopper"—Pueblo’s legendary open-faced cheeseburger smothered in green chile sauce—and the focal point of the annual Pueblo Chile & Frijoles Festival, which draws over 100,000 visitors to Union Avenue every September. The crop is a source of immense civic pride, representing a resilient, agricultural community that honors its immigrant roots.</p>
    `
  },
  {
    title: 'Steel City Startups: Inside the New Coworking Space in Union Avenue District',
    slug: 'steel-city-startups-new-coworking-space-union-avenue',
    tag: tags[1], // Business & Dev
    image: images.coworking,
    featured: 0,
    visibility: 'public',
    custom_excerpt: 'A renovated brick-and-timber warehouse becomes a launchpad for local remote workers, creative professionals, and tech entrepreneurs.',
    html: `
      <p>PUEBLO — Inside a meticulously restored 1890s brick warehouse in the historic Union Avenue District, a new kind of economy is taking shape. Exposed wooden beams, historic industrial windows, and modern glass dividers define "The Foundry," Pueblo's first dedicated coworking space and startup incubator.</p>
      <h2>Modern Workspace in Historic Bones</h2>
      <p>The project, funded in part by a local urban renewal grant, offers flexible desks, private offices, high-speed fiber internet, and meeting rooms for remote workers, freelancers, and entrepreneurs. "Pueblo has a rich history of making things," says founder Lucas Sterling. "The Foundry is about making digital products, services, and companies. We wanted to build a space that honors our industrial past while supporting our digital future."</p>
      <p>The space has already attracted a diverse membership, from software engineers working for national firms to local graphic designers and nonprofit organizers. By creating a collaborative environment, Sterling hopes to foster startup creation in Pueblo, retaining young professional talent who would otherwise migrate to Denver or Colorado Springs.</p>
      <h2>Fostering Community Collaboration</h2>
      <p>The Foundry hosts weekly networking events, educational workshops, and pitch nights where local founders can showcase their projects to community members and potential investors. "Being a solo remote worker can be isolating," noted member Elena Cruz. "Here, I’m surrounded by people who are creating and solving problems. The energy is contagious, and it makes me feel connected to the future of Pueblo."</p>
    `
  },
  {
    title: 'Pueblo West Residents Raise Concerns Over Emergency Response Times',
    slug: 'pueblo-west-residents-concerns-emergency-response-times',
    tag: tags[2], // Community Affairs
    image: images.sunset,
    featured: 0,
    visibility: 'members',
    custom_excerpt: 'As residential subdivisions expand rapidly across the plains, local fire and medical services struggle to maintain response standards on a strained budget.',
    html: `
      <p>PUEBLO WEST — Homeowners in the northern stretches of Pueblo West are calling for urgent county action after a series of medical emergencies highlighted growing delays in first responder arrival times.</p>
      <h2>The Cost of Rapid Expansion</h2>
      <p>Pueblo West has grown rapidly over the last decade, transitioning from a quiet semi-rural enclave into a large suburban community of nearly 33,000 residents. However, funding for emergency services has not kept pace with this growth. The local metropolitan district operates just three fire stations covering a massive 49-square-mile territory.</p>
      <p>"When my husband had a cardiac event last month, it took the ambulance nearly 18 minutes to reach our house," said resident Evelyn Miller during a county board meeting. "The firefighters did an amazing job when they arrived, but 18 minutes in an emergency is an eternity. We are building thousands of new homes without building the stations to protect them."</p>
      <h2>Budgetary Constraints and Levies</h2>
      <p>Fire Chief Thomas O’Connor acknowledged the response time challenges, noting that the department is currently operating at minimum staffing levels due to budget limitations. "Our staff is dedicated and highly trained, but we can only stretch our resources so far," O'Connor stated. "We are currently averaging 11 minutes for high-priority calls in our outer sectors, whereas the national standard is under 8 minutes."</p>
      <p>Local leaders are discussing a potential ballot measure for the upcoming November election that would increase property tax mill levies to fund the construction of a fourth fire station and hire additional paramedics. However, in a working-class community facing rising cost-of-living pressures, tax increases face a steep climb.</p>
    `
  }
];

// Output SQL script
console.log('-- Pueblo Patriot Mock Posts Seeding SQL Script --');
console.log('USE patriot_dev;');
console.log('SET FOREIGN_KEY_CHECKS = 0;');

// Clear existing default mock data if present to avoid pollution
console.log("DELETE FROM posts WHERE slug IN ('coming-soon', 'about');");
console.log("DELETE FROM posts_authors WHERE post_id IN (SELECT id FROM posts WHERE slug IN ('coming-soon', 'about'));");
console.log("DELETE FROM posts_tags WHERE post_id IN (SELECT id FROM posts WHERE slug IN ('coming-soon', 'about'));");

const mockSlugs = mockPosts.map(p => `'${p.slug}'`).join(', ');
console.log(`DELETE FROM posts WHERE slug IN (${mockSlugs});`);
console.log(`DELETE FROM posts_authors WHERE post_id IN (SELECT id FROM posts WHERE slug IN (${mockSlugs}));`);
console.log(`DELETE FROM posts_tags WHERE post_id IN (SELECT id FROM posts WHERE slug IN (${mockSlugs}));`);

// Insert Tags
console.log('\n-- Inserting Custom Tags --');
tags.forEach(t => {
  console.log(`INSERT INTO tags (id, name, slug, description, created_at, updated_at) VALUES ('${t.id}', '${t.name}', '${t.slug}', 'Reporting beat covering ${t.name} in Pueblo County.', NOW(), NOW()) ON DUPLICATE KEY UPDATE name=name;`);
});

// Select the first user in the database to bind posts to
console.log('\n-- Binding to first user --');
console.log('SET @author_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1);');

// Insert Posts, Tag Links, and Author Links
console.log('\n-- Inserting Mock Posts --');
mockPosts.forEach((p, idx) => {
  const postId = makeGhostId();
  const postUuid = makeUuid();
  
  // Format dates so they are slightly staggered in time
  const hoursAgo = (mockPosts.length - idx) * 12;
  const dateExpr = `DATE_SUB(NOW(), INTERVAL ${hoursAgo} HOUR)`;
  
  // Escape strings for SQL safety
  const cleanTitle = p.title.replace(/'/g, "''");
  const cleanExcerpt = p.custom_excerpt.replace(/'/g, "''");
  const cleanHtml = p.html.trim().replace(/'/g, "''");
  // Simple plain text strip
  const cleanPlainText = p.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 400).replace(/'/g, "''") + '...';

  // Render SQL statement for posts table
  console.log(`
INSERT INTO posts (
  id, uuid, title, slug, html, plaintext, feature_image, featured, type, status, visibility,
  created_at, updated_at, published_at, published_by, custom_excerpt, comment_id, show_title_and_feature_image,
  email_recipient_filter
) VALUES (
  '${postId}',
  '${postUuid}',
  '${cleanTitle}',
  '${p.slug}',
  '${cleanHtml}',
  '${cleanPlainText}',
  '${p.image}',
  ${p.featured},
  'post',
  'published',
  '${p.visibility}',
  ${dateExpr},
  ${dateExpr},
  ${dateExpr},
  @author_id,
  '${cleanExcerpt}',
  '${postId}',
  1,
  'all'
);
  `.trim());

  // Link Post to Tag
  const postTagId = makeGhostId();
  console.log(`INSERT INTO posts_tags (id, post_id, tag_id, sort_order) VALUES ('${postTagId}', '${postId}', '${p.tag.id}', 0);`);

  // Link Post to Author
  const postAuthorId = makeGhostId();
  console.log(`INSERT INTO posts_authors (id, post_id, author_id, sort_order) VALUES ('${postAuthorId}', '${postId}', @author_id, 0);`);
  console.log('-- ------------------------------------------------');
});

console.log('SET FOREIGN_KEY_CHECKS = 1;');
console.log('\n-- Seeding Complete --');
