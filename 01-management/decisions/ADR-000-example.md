# ADR-000: Example Architecture Decision Record

**Status:** Accepted
**Date:** 2026-03-19
**Author:** Kronenz

> **Note:** This is an example ADR showing the required format. ADRs are immutable — once accepted, they are never modified. To change a decision, create a new ADR with `Supersedes: ADR-NNN` in the header.

---

## Context

[Describe the situation that forced a decision. What problem were you facing? What constraints existed? What options were on the table? This section explains WHY a decision was needed.]

Example:
> The application needs a way to manage user sessions. We evaluated JWT tokens, server-side sessions, and OAuth. The team needed to pick one approach before authentication work could begin.

---

## Decision

[State clearly what was decided. Be specific. One paragraph is usually enough.]

Example:
> We will use JWT tokens stored in HTTP-only cookies for session management. Tokens will expire after 24 hours with a sliding refresh window.

---

## Consequences

### Positive
- [POSITIVE_CONSEQUENCE_1]
- [POSITIVE_CONSEQUENCE_2]

### Negative / Trade-offs
- [NEGATIVE_CONSEQUENCE_1]
- [NEGATIVE_CONSEQUENCE_2]

### Neutral
- [NEUTRAL_CONSEQUENCE — things that are just different, not better or worse]

---

## Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| [ALTERNATIVE_1] | [REASON] |
| [ALTERNATIVE_2] | [REASON] |

---

## References

- [LINK_OR_DOCUMENT_1]
- [LINK_OR_DOCUMENT_2]
