# Localization Guide

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

> **Note:** Remove this file if your project uses only English for both documentation and UI.

---

## Primary Language

| Context | Language |
|---------|----------|
| App UI labels and content | Korean |
| Code and code comments | English |
| Planning documents | English |
| Task and bug-fix documents | English |
| Design guidelines | English |

**Target language:** Korean
**Locale code:** [LOCALE_CODE] (e.g., `ko`, `ja`, `fr`, `ar`)

---

## Language Context Table

| Surface | Language | Examples |
|---------|----------|---------|
| Variable names | English | `studentName`, `isActive` |
| Code comments | English | `// Fetch session list from API` |
| Git commit messages | English | `fix: correct pagination offset` |
| PRD / ARCHITECTURE docs | English | Requirements, architecture decisions |
| PLAN.md / CHECKLIST.md | English | Task plans, subtask lists |
| Button labels | Korean | Save, Cancel, Delete |
| Form labels | Korean | Name, Email, Phone |
| Error messages | Korean | "This field is required" |
| Navigation items | Korean | Dashboard, Settings, Profile |
| Notification content | Korean | Push and in-app notifications |

---

## Referencing Target-Language Terms in English Docs

When a planning document must reference a UI label or domain term in Korean, use the format:

```
English term (Korean: [NATIVE_TERM])
```

Example (Korean): `Attendance (출석)`, `Makeup class (보강)`, `Cancellation (결강)`

---

## Translation Workflow

1. Write UI strings in Korean directly in component templates (for small projects) or in a message catalog file (for larger projects).
2. If using a message catalog (e.g., `i18n/[LOCALE_CODE].json`), add the key and translation together — do not leave keys untranslated.
3. When a string changes meaning, update both the key label (if applicable) and the translation.
4. Content Forge-specific workflow: [Describe how translations are managed — catalog file location, review process, etc.]

---

## String Management

| Approach | When to Use |
|----------|-------------|
| Inline strings in templates | Small projects; single-language UI |
| Catalog file (`i18n/*.json`) | Multi-language support or centralized string management |
| Third-party i18n library | When pluralization, interpolation, or locale switching is needed |

**This project uses:** [DESCRIBE APPROACH]

Catalog file location (if applicable): `[PATH_TO_I18N_FILES]`

---

## Date and Number Formatting

| Data Type | Format / Locale | Example |
|-----------|----------------|---------|
| Short date | [DATE_FORMAT] | [EXAMPLE] |
| Long date | [DATE_FORMAT] | [EXAMPLE] |
| Time | [TIME_FORMAT] | [EXAMPLE] |
| Currency | [CURRENCY_FORMAT] | [EXAMPLE] |
| Decimal separator | [SEPARATOR] | 1,234.56 or 1.234,56 |
| Thousands separator | [SEPARATOR] | — |

> Use the platform's built-in `Intl.DateTimeFormat` and `Intl.NumberFormat` APIs with the target locale code rather than manual formatting.

---

## RTL Support

**Does this project require right-to-left (RTL) layout?** [YES / NO]

If YES:
- Use logical CSS properties (`margin-inline-start` instead of `margin-left`, etc.) throughout.
- Test all layouts with `dir="rtl"` set on the `<html>` element.
- Ensure icons with directional meaning (arrows, chevrons) are mirrored in RTL mode.
- Document RTL-specific overrides in this section.

If NO: delete this section.
