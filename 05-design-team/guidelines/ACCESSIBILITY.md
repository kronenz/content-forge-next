# Accessibility Guidelines

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Compliance Target

This project targets **WCAG 2.1 Level AA** compliance for all user-facing interfaces.

---

## Color Contrast

| Context | Minimum Ratio | Notes |
|---------|--------------|-------|
| Normal text (< 18pt / < 14pt bold) | 4.5:1 | Body copy, labels, captions |
| Large text (>= 18pt / >= 14pt bold) | 3:1 | Headings, display text |
| UI components and graphical objects | 3:1 | Buttons, inputs, icons, chart elements |
| Disabled elements | No requirement | Disabled state is exempt |

- Verify contrast ratios for all brand color combinations using a contrast checker tool before finalizing the palette.
- Do not rely on color alone to convey meaning — always pair color with text, icons, or patterns.

---

## Keyboard Navigation

- All interactive elements (buttons, links, inputs, dropdowns, modals) must be reachable and operable via keyboard alone.
- **Tab order** must follow the visual reading order of the page (left-to-right, top-to-bottom).
- **Focus indicators** must be clearly visible. Do not remove or suppress the browser default outline without replacing it with a custom, high-contrast focus ring.
- **Skip links:** Provide a "Skip to main content" link as the first focusable element on each page, visible on focus.
- Modal dialogs must **trap focus** within the dialog while open and **restore focus** to the trigger element on close.
- Dropdown menus and custom widgets must support arrow-key navigation where applicable.

---

## Screen Reader Support

- Use semantic HTML elements (`<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`) to convey document structure.
- Every image must have an `alt` attribute. Decorative images use `alt=""`.
- Every form input must have an associated `<label>` (visible or visually hidden). Do not use `placeholder` as the only label.
- Icons used as interactive controls must have an `aria-label` or paired visually hidden text.
- Purely decorative icons must be marked `aria-hidden="true"`.
- Use **ARIA live regions** (`aria-live="polite"` or `aria-live="assertive"`) for dynamic content updates (toast notifications, inline validation results, loading completions).
- Avoid using ARIA roles, states, or properties that override correct native semantics — prefer native HTML over ARIA when possible.

---

## Touch Targets

- Minimum touch target size: **44 x 44px** for all interactive elements.
- Maintain at least **8px** of spacing between adjacent touch targets to prevent accidental taps.
- This applies to icon-only buttons, checkboxes, radio buttons, and custom controls.

---

## Motion and Animation

- Respect the `prefers-reduced-motion` media query. When this preference is set:
  - Disable or significantly reduce decorative animations and transitions.
  - Do not remove animations that are essential to communicating state changes — substitute with instant transitions instead.
- Avoid content that flashes more than 3 times per second (WCAG 2.3.1).
- Provide pause/stop controls for any auto-playing animated content.

---

## Forms

- All form fields must have a visible, descriptive label.
- Required fields must be identified both visually (asterisk) and programmatically (`aria-required="true"` or `required` attribute).
- Error messages must:
  - Be associated with the relevant field via `aria-describedby`.
  - Be announced to screen readers when they appear (use `role="alert"` or a live region).
  - Explain clearly what is wrong and how to fix it.
- Group related fields with `<fieldset>` and `<legend>`.

---

## Testing Tools

Use the following tools to audit accessibility during development and before release:

| Tool | Type | Usage |
|------|------|-------|
| axe DevTools | Browser extension | Automated in-browser audit |
| Lighthouse | Browser / CI | Automated accessibility score |
| WAVE | Browser extension | Visual overlay of issues |
| NVDA (Windows) | Screen reader | Manual screen reader testing |
| VoiceOver (macOS/iOS) | Screen reader | Manual screen reader testing |
| TalkBack (Android) | Screen reader | Manual screen reader testing on mobile |
| Keyboard-only navigation | Manual | Tab through every page without a mouse |

- Run automated tools on every page at least once before release.
- Perform at least one manual keyboard-navigation pass per major flow.
- Perform at least one screen reader pass per major flow before launch.
