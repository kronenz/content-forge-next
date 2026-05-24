# Design System

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | [BRAND_COLOR_PRIMARY] | Main actions, links, key UI elements |
| Primary Dark | [BRAND_COLOR_PRIMARY_DARK] | Hover states, active states |
| Secondary | [BRAND_COLOR_SECONDARY] | Supporting accents, highlights |
| Background | [BRAND_COLOR_BACKGROUND] | Page background |
| Surface | [BRAND_COLOR_SURFACE] | Card and panel backgrounds |
| Error | [BRAND_COLOR_ERROR] | Error states, destructive actions |
| Warning | [BRAND_COLOR_WARNING] | Caution indicators |
| Success | [BRAND_COLOR_SUCCESS] | Confirmation, positive outcomes |
| Text Primary | [BRAND_COLOR_TEXT_PRIMARY] | Body text, headings |
| Text Secondary | [BRAND_COLOR_TEXT_SECONDARY] | Labels, captions, helper text |
| Border | [BRAND_COLOR_BORDER] | Dividers, input outlines |

> Replace each `[BRAND_COLOR_*]` placeholder with the actual hex value (e.g., `#2196C8`).

---

## Typography

**Font Family:** [FONT_FAMILY_PRIMARY] (headings and body)
**Fallback stack:** `system-ui, -apple-system, sans-serif`

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Hero headings, splash screens |
| H1 | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Page titles |
| H2 | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Section headings |
| H3 | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Subsection headings |
| Body Large | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Primary body text |
| Body | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Default body text |
| Body Small | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Secondary descriptions |
| Caption | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Labels, metadata, timestamps |
| Overline | [SIZE] | [WEIGHT] | [LINE_HEIGHT] | Category labels, tags |

---

## Spacing

Base grid unit: **4px**

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps between related elements |
| `space-2` | 8px | Inner component padding (small) |
| `space-3` | 12px | Inner component padding (medium) |
| `space-4` | 16px | Standard content padding |
| `space-5` | 20px | — |
| `space-6` | 24px | Section internal spacing |
| `space-8` | 32px | Section separation |
| `space-10` | 40px | Large section separation |
| `space-12` | 48px | Page-level section gaps |
| `space-16` | 64px | Hero / splash spacing |

---

## Shadows & Elevation

<!-- Choose one of the following and delete the other -->

### Option A: Elevation-based shadows

| Level | Token | CSS Value | Usage |
|-------|-------|-----------|-------|
| 0 | `elevation-0` | `none` | Flat elements, backgrounds |
| 1 | `elevation-1` | `[CSS_BOX_SHADOW]` | Cards, dropdowns |
| 2 | `elevation-2` | `[CSS_BOX_SHADOW]` | Floating buttons, tooltips |
| 3 | `elevation-3` | `[CSS_BOX_SHADOW]` | Modals, dialogs |
| 4 | `elevation-4` | `[CSS_BOX_SHADOW]` | Navigation drawers |

### Option B: Flat design (no shadows)

This project uses a flat design aesthetic. Depth is conveyed through border color and background contrast rather than box shadows.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Sharp-cornered elements |
| `radius-sm` | [VALUE] | Inputs, chips, small tags |
| `radius-md` | [VALUE] | Cards, buttons |
| `radius-lg` | [VALUE] | Modals, large panels |
| `radius-xl` | [VALUE] | Bottom sheets, drawers |
| `radius-full` | 9999px | Pills, badges, avatar circles |

---

## Component Specifications

Component-level specifications (button variants, input states, card layouts, etc.) are documented in:

**`05-design-team/guidelines/UI-PATTERNS.md`**

Follow those patterns for all component implementations. Do not deviate without a design review.

---

## Icon Usage

Icon sizing, stroke conventions, and the full action-to-icon mapping are documented in:

**`05-design-team/guidelines/ICON-LIBRARY.md`**

Always source icons from the designated icon library. Do not mix icon sets or use emoji as icons.
