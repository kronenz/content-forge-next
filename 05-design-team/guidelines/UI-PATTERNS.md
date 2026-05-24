# UI Patterns

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Navigation Patterns

### Sidebar Navigation
Use for desktop-primary applications with many top-level sections (5+). Sidebar should be collapsible on smaller viewports.

- Highlight the active route with a distinct background or left-border indicator.
- Group related items under collapsible section headers.
- Place destructive or administrative items at the bottom of the sidebar.

**Content Forge-specific notes:** [Describe which app(s) use sidebar nav and any project-specific rules]

### Bottom Navigation
Use for mobile-primary applications with 3–5 top-level destinations. Do not use bottom nav for more than 5 items.

- Always show a label beneath each icon.
- Indicate the active tab with the primary brand color.
- Reserve the center slot (if 5 items) for the primary action.

**Content Forge-specific notes:** [Describe which app(s) use bottom nav and any project-specific rules]

### Breadcrumbs
Use on desktop for hierarchical content (3+ levels deep). Do not show breadcrumbs for flat or single-level navigation.

- Truncate long ancestor labels with an ellipsis.
- The current page label is plain text (not a link).

**Content Forge-specific notes:** [Describe pages where breadcrumbs are used]

---

## Form Patterns

### Field Layout
- Stack fields vertically (single column) on mobile.
- Two-column grid is acceptable on wide desktop layouts for short fields (e.g., first name / last name).
- Group related fields visually using spacing or a section divider.

### Validation
- Validate on blur (when a field loses focus), not on every keystroke.
- Show inline error messages directly beneath the field, in the error color.
- Do not rely solely on color to convey error state — use an icon or text label.

### Error Messages
- Be specific: "Email address is required" not "Invalid input."
- Use sentence case. Do not end with a period.
- Place the message immediately below the field it applies to.

### Required Fields
- Mark required fields with an asterisk (*) and a legend at the top of the form: "* Required."
- Do not mark optional fields — assume all unlabeled fields are optional.

**Content Forge-specific notes:** [Describe any project-specific form conventions]

---

## Table Patterns

### Sorting
- Clicking a column header sorts ascending; clicking again sorts descending.
- Show a sort indicator arrow (up/down) in the active column header.
- Default sort column and direction should be documented per-page.

### Filtering
- Place filter controls above the table.
- Apply filters immediately (no submit button) when possible.
- Show an active-filter indicator or chip summary when filters are applied.

### Pagination
- Show page size selector (e.g., 10 / 25 / 50 rows per page).
- Display total record count and current range: "Showing 1–25 of 143."
- Prefer server-side pagination for large datasets.

**Content Forge-specific notes:** [Describe default page sizes, any tables that use infinite scroll, etc.]

---

## Modal Patterns

### Confirmation Dialogs
Use for irreversible or high-impact actions (delete, deactivate, submit final).

- Title: Action in plain language — "Delete [Item Name]?"
- Body: One sentence explaining the consequence — "This cannot be undone."
- Buttons: Cancel (secondary/outlined) on the left, Confirm (primary or destructive) on the right.
- Do not auto-dismiss confirmation dialogs.

### Form Modals
Use for create/edit workflows that do not warrant a full page.

- Include a clear title ("Add Student," "Edit Schedule").
- Place the Save/Submit button in the modal footer, right-aligned.
- Validate before submitting; keep the modal open and show errors on failure.
- Close the modal on success and refresh the underlying list.

**Content Forge-specific notes:** [Describe any size constraints, stacking behavior, etc.]

---

## Card Patterns

### Content Cards
Use to group a discrete piece of information (a record, an item, a summary).

- Consistent padding using spacing tokens (see DESIGN-SYSTEM.md).
- Include a clear card title at the top.
- Optional: header action (icon button) top-right.
- Optional: footer with secondary actions or metadata.

### Summary / Stat Cards
Use on dashboards to surface a key metric.

- Large numeric value centered or left-aligned.
- Small label below (or above) the value describing the metric.
- Optional: trend indicator (up/down arrow + delta value).
- Keep cards uniform in size within the same dashboard row.

**Content Forge-specific notes:** [Describe which pages use cards and any layout rules]

---

## Empty States

### No Data
Displayed when a list or table has zero results (not due to an error).

- Show an appropriate icon above the message.
- Primary message: short, plain language — "No students found."
- Secondary message (optional): a brief suggestion — "Try adjusting your filters."
- Optional: a primary action button — "Add Student."

### Error State
Displayed when a data-fetch request fails.

- Show an error icon.
- Primary message: "Something went wrong."
- Secondary message: "Please try again. If the problem continues, contact support."
- Include a Retry button.

### Loading State
Displayed while data is being fetched.

- Use a skeleton loader that mirrors the shape of the expected content (preferred over a spinner for list/table views).
- Use a centered spinner only for full-page loads or modal submissions.
- Do not show "Loading..." text without a visual indicator.

**Content Forge-specific notes:** [Describe any project-specific empty state copy or imagery]
