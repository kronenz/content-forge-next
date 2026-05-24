# Icon Library

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

> **Note:** Replace `Lucide` throughout this document with your chosen icon library
> (e.g., Lucide, Heroicons, Material Icons, Phosphor Icons).

---

## Icon Library

This project uses **Lucide** as its sole icon source. Do not mix icon sets or use emoji as icons.

---

## Icon Sizing

| Size | Value | Usage |
|------|-------|-------|
| XS | 12px | Badge indicators, dense table cells |
| Small | 16px | Inline icons, button icons, input adornments |
| Medium | 20px | Default standalone icons, list item icons |
| Large | 24px | Navigation icons, section icons |
| XL | 32px | Empty-state illustrations, feature icons |
| XXL | 48px | Hero icons, onboarding screens |

---

## Stroke Width Convention

| Context | Stroke Width | Notes |
|---------|-------------|-------|
| Default UI | [STROKE_WIDTH] | Most icons in lists, tables, buttons |
| Navigation | [STROKE_WIDTH] | Sidebar and bottom-nav icons |
| Emphasis | [STROKE_WIDTH] | Highlighted or active state icons |

> Choose a consistent stroke width across the project and record it above.
> A stroke width of 1.5 works well for most UI contexts.

---

## Common Icon Mappings

| Action / Concept | Icon Name | Usage Notes |
|-----------------|-----------|-------------|
| Add / Create | [ICON_ADD] | Buttons for creating new records |
| Edit / Modify | [ICON_EDIT] | Row actions, edit form triggers |
| Delete / Remove | [ICON_DELETE] | Destructive row actions, confirmation dialogs |
| Search | [ICON_SEARCH] | Search input adornment, search page |
| Settings / Config | [ICON_SETTINGS] | Account settings, system configuration |
| Close / Dismiss | [ICON_CLOSE] | Modal close buttons, chip removal |
| Menu / Hamburger | [ICON_MENU] | Mobile nav toggle, collapsed sidebar |
| User / Profile | [ICON_USER] | User avatar fallback, profile section |
| Notification / Alert | [ICON_NOTIFICATION] | Notification bell, alert indicators |
| Save / Confirm | [ICON_SAVE] | Save actions, submit confirmations |

> Fill in the `[ICON_*]` placeholders with the exact icon name from your chosen library.
> Example for Lucide: `Add / Create | Plus | ...`

---

## Usage Rules

1. **No emoji.** All visual indicators must use icons from Lucide.
2. **Consistent sizing.** Use the sizing table above — do not use ad-hoc pixel values.
3. **Consistent stroke width.** All icons must use the stroke width defined above.
4. **Accessible labels.** Every icon used as an interactive element (button, link) must have an accessible label (aria-label or visually hidden text).
5. **Decorative icons.** Icons that are purely decorative (accompanied by visible text) should be marked `aria-hidden="true"`.
6. **Color.** Icons inherit the current text color by default. Use brand color tokens from DESIGN-SYSTEM.md when tinting icons intentionally.

---

## Extending the Mapping Table

When adding a new icon to the project:

1. Search Lucide for the closest semantic match.
2. Add a row to the Common Icon Mappings table above.
3. Update this file and commit the change so the team stays in sync.
