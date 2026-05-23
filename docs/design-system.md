# Pueblo Patriot Design System Guidelines

This document outlines the coherent visual design language, tokens, and templates configured for the **Pueblo Patriot** theme. Developers must reference these specifications to maintain visual consistency across all pages and layouts.

---

## 1. Color Palette (Visual Identity Tokens)

Our colors are derived from the regional landscape and industrial heritage of Pueblo, Colorado:

| Token | CSS Variable | Hex | Role | Contrast Context |
| :--- | :--- | :--- | :--- | :--- |
| **Sky** | `--color-sky` | `#1B3F8B` | Primary Blue | Used for primary branding accents, links, navigation details, and interactive buttons. |
| **Brick** | `--color-brick` | `#B0473C` | Accent Red | Used for article kickers, category tags, error states, and decorative blockquote lines. |
| **Sun** | `--color-sun` | `#D9A23D` | Accent Gold | Used for paywall borders, membership badge outlines, and subscription prompts. |
| **Paper** | `--color-paper` | `#F6F2EA` | Background | Warm, low-contrast off-white page canvas resembling traditional newsprint. |
| **Ink** | `--color-ink` | `#16181D` | Text & Titlepiece | Deep charcoal (never absolute black) used for body copy and the unified logo title. |
| **Border** | `--color-border` | `#E3DDD3` | Borders | Hairline broadsheet columns, dividers, and sidebar separators. |

---

## 2. Typography Hierarchy

We load self-hosted/CDN Google Fonts mapped to explicit functional roles to optimize the tension between digital scanning speeds and print-editorial aesthetics.

### 1. Identity Serif (Masthead Logo)
- **Family**: `"UnifrakturMaguntia", serif`
- **Use**: Main header titlepiece logo.
- **Role**: Emulates traditional print-press blackletter typeface. Always rendered in a solid, flat `--color-ink` tone.

### 2. Display Serif (Headlines)
- **Family**: `"Fraunces", Georgia, serif`
- **Use**: Page titles (`h1`), index feed titles (`h2`, `h3`, `.lead-story-title`), section headers.
- **Attributes**: Line-height restricted to `1.0`–`1.15` for dense, high-impact titles. Features vintage woodblock curvatures.

### 3. Reading Serif (Long-Form Body)
- **Family**: `"Newsreader", serif`
- **Use**: Long-form article text (`.article-content p`, blockquotes).
- **Attributes**: Variable optical sizes are configured for micro-typographical legibility at small sizes; line-height scaled to `1.625`.

### 4. Grotesque Sans-Serif (UI & Navigation)
- **Family**: `"IBM Plex Sans", sans-serif`
- **Use**: Navigation links, buttons, sidebar beats list, form controls, footer resources.
- **Attributes**: Font weight scaled from `400` to `700` for structure.

### 5. Monospace (Metadata)
- **Family**: `"JetBrains Mono", monospace`
- **Use**: Timestamps, kicker tags, word/read counters, form labels.
- **Attributes**: Capitalized (`text-transform: uppercase`) with positive tracking (`letter-spacing: 0.05em`).

---

## 3. Structural Rules & Broadsheet Grids

To mimic a physical print broadsheet, we enforce a **flat column layout** separated by explicit typographical borders:

1. **The Broadsheet Rule (No Cards)**:
   - Articles do not use background card containers, rounded corners, or modern drop-shadows. They rest directly on the `--color-paper` background canvas.
   - This prevents the site from looking like a generic software blog or SaaS landing page, grounding it in editorial authority.
2. **Editorial Divider Rules**:
   - Primary homepage columns are separated by vertical divider rules (`1px solid var(--color-border)`).
   - Major structural sections (the header, the sidebar, the sponsor strip, and the latest news feed) are separated by horizontal rules.
   - The brand header masthead and navigation menu are framed by double-line border rules (`3px double var(--color-ink)`).
3. **Three-Column Homepage Layout**:
   - The desktop homepage features a three-part layout to maximize typographical density and scanning pace:
     - **Left Column (Secondary Stories)**: Occupies `3 columns` (of a 12-column system) containing high-density text headlines and short descriptions.
     - **Center Column (Lead Story)**: Occupies `6 columns`, containing the primary lead story with its prominent feature image, large display title, and lead-in text.
     - **Right Column (Civic Sidebar)**: Occupies `3 columns`, housing the beats navigator, community notice/discourse box, and local sponsor spotlight.
     - Thin vertical borders separate these columns.
     - Breakpoints collapse this grid: at `1024px` (tablet landscape), it transitions to a two-column layout; at `768px` (mobile/portrait), it collapses to a single stacked column.
4. **Editorial Blockquote Framing**:
   - Blockquotes are styled as pull-out quotes framed by top and bottom double-line borders (`3px double var(--color-brick)`), centered or offset without a left border, matching high-end print news design.

---

## 4. Layout & Animation Stability

To prevent modern web anomalies, we enforce layout stability guidelines:

- **Anti-Jitter Transitions**: All hover-triggered border reveals (such as navigation links) must use transparent default borders (`border-bottom: 2px solid transparent`) to lock vertical heights, changing only the `border-color` on hover.
- **Scroll Animating Properties**: When implementing scroll-driven features (like our scroll progress bar), animate only compositor-friendly properties (`transform` and `opacity`) to ensure solid frame rates.
- **Text Wrapping**:
  - Always apply `text-wrap: balance` to short heading blocks (`h1`-`h6`) to balance multi-line wraps.
  - Apply `text-wrap: pretty` to body text blocks (`p`, `blockquote`, `li`) to eliminate single-word orphans at the end of paragraphs.

---

## 5. Dark Theme Inversion

Our dark theme is implemented by re-mapping core CSS variables inside a media query rather than inserting custom utility classes. 

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-paper: #121418;      /* Paper becomes deep charcoal background */
    --color-ink: #EAE5DB;        /* Ink becomes warm off-white text */
    --color-ink-muted: #8E95A2;  
    --color-border: #242831;     
    --color-white: #1B1D24;      /* Lighter card container backgrounds */
    
    /* Contrast-compliant pastels for dark backgrounds */
    --color-sky: #5583E6;        
    --color-brick: #D46A5D;      
    --color-sun: #E1B258;        
  }
}
```
This ensures the entire layout updates seamlessly to dark mode while remaining compliant with contrast accessibility standards.
