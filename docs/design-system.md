# Pueblo Patriot Design System Guidelines

This document outlines the coherent visual design language, tokens, and templates configured for the **Pueblo Patriot** theme. Developers must reference these specifications to maintain visual consistency across all pages and layouts.

---

## 1. Color Palette (Visual Identity Tokens)

Our colors are derived from the regional landscape and industrial heritage of Pueblo, Colorado:

| Token | CSS Variable | Hex | Role | Contrast Context |
| :--- | :--- | :--- | :--- | :--- |
| **Sky** | `--color-sky` | `#1B3F8B` | Primary Blue | Used for brand title, links, navigation accents, and buttons. |
| **Brick** | `--color-brick` | `#B0473C` | Accent Red | Used for kickers, category tags, warnings, and quote accents. |
| **Sun** | `--color-sun` | `#D9A23D` | Accent Gold | Gated member badges, paywall borders, and secondary highlights. |
| **Paper** | `--color-paper` | `#F6F2EA` | Background | Warm off-white page background. Reduces harsh blue-light strain. |
| **Ink** | `--color-ink` | `#16181D` | Text | Deep charcoal (never pure black) body copy for high readability. |
| **Border** | `--color-border` | `#E3DDD3` | Borders | Grid lines, sidebar separations, and dividers. |

---

## 2. Typography

We use self-hosted/CDN Google Fonts selected to emulate the vintage print newspaper tradition while remaining readable on modern displays.

### Headline Typography (Serif)
- **Family**: `"Newsreader", Georgia, serif`
- **Use**: Page titles (`h1`), article titles (`h2`, `h3`), blockquotes, and long-form narrative.
- **Attributes**: Line-height should hover around `1.0` to `1.15` for tight, elegant newspaper titles.

### Body Copy & UI (Sans-Serif)
- **Family**: `"IBM Plex Sans", sans-serif`
- **Use**: Body text, navigation elements, sidebars, buttons, metadata.
- **Attributes**: Line-height is scaled to `1.625` for optimal reading tracking.

### Code & Metadata (Monospace)
- **Family**: `"JetBrains Mono", monospace`
- **Use**: Date displays, reading times, tags, code snippets, form labels.
- **Attributes**: Always set to `text-transform: uppercase` and `letter-spacing: 0.05em` when used as kicks/headers.

---

## 3. Structural Rules & Broadsheet Grids

To mimic a physical print broadsheet, we favor vertical/horizontal border rules over soft shadows or rounded panels:

1. **Editorial Divider Rules**:
   - Sections are separated by `1px solid var(--color-border)` lines.
   - The primary logo and navigation bar are bound by double-line border rules (`3px double var(--color-ink)`).
2. **Layout Grid**:
   - The Home Page uses a `12-column` CSS Grid with a gap of `2rem` (`--space-lg`).
   - The **Lead Story** spans `8 columns` on large screens, while the **Civic Sidebar** occupies `4 columns`.
   - Responsive breakpoints wrap columns into vertical listings at `900px` and `600px` viewports.

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
