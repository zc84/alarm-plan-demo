# UI Reuse Instructions (Dashboard Patterns)

Use this guide to apply the same Dashboard UX patterns on other pages.

## UI/UX skill to use (best choice)

The relevant skill in this environment is **`artifact-design`** (UI/UX design fundamentals — hierarchy, spacing, theming, contrast). Invoke it before doing visual work. For KPI number/stat treatments specifically, **`dataviz`** is also useful.

The guiding *principle* these patterns follow is **information hierarchy** (this is a design principle, not a separately invokable skill).

Why this is the right principle here:
- KPI numbers (like *Action items* and *Priority focus*) are primary data and must be visually dominant.
- Notification cross-links are secondary actions and should be visible but not louder than the message.
- A clear hierarchy helps users scan quickly during operational work.

How to apply it in this project:
1. Make key numbers the strongest visual element (size and weight first). **Alignment follows the card type** — the primary overview KPIs (`.stats-link`) stay left-aligned in a grid; only the compact secondary summary chips (`.dashboard-hero-chips`) are centered. Do not center a left-aligned KPI card just to follow this doc.
2. Keep labels short and supportive (uppercase caption style is fine).
3. Keep notification body text readable and calm.
4. Render cross-links as clear secondary CTAs (small but high-contrast, consistent position).
5. Preserve spacing rhythm (`margin-top`, small gaps) so cards are easy to scan.
6. Respect the active role theme — drive color from tokens (`var(--muted-text)`, `var(--dashboard-*)`), never hardcode the rose palette, so the command/field/district themes stay consistent.

Quick self-check before shipping:
- Can I identify the key number in under 1 second?
- Can I understand the notification meaning without clicking?
- Is the cross-link obvious, but not visually competing with the title/value?
- Does the page still read correctly under every role theme (not just the default rose one)?

## 1) Center numbers inside compact summary chips

> Scope: this applies to the small **summary chips** (`.dashboard-hero-chips`), not the primary overview KPI cards (`.stats-link`), which stay left-aligned. Center only where the chip is a compact 2-up/3-up summary.

### Markup pattern

```tsx
<div className="dashboard-hero-chips">
  <span>
    Action items
    <strong>{totalActionItems}</strong>
  </span>
  <span>
    Priority focus
    <strong>{criticalFocus}</strong>
  </span>
</div>
```

### CSS pattern

```css
.dashboard-hero-chips span {
  display: grid;
  gap: 0.15rem;
}

.dashboard-hero-chips strong {
  display: block;
  text-align: center;
}
```

> In Dashboard this is implemented via `.dashboard-hero-chips span` / `.dashboard-hero-chips strong` in `src/App.css`.

---

## 2) Add cross-links for notification list items

### Goal
Each notification can optionally show a contextual "open" link to the related module.

### Helper pattern (content-based routing)

```tsx
const getNotificationLink = (title: string, body: string) => {
  const normalized = `${title} ${body}`.toLowerCase()

  if (normalized.includes('approval')) {
    return { to: '/approval-center', label: 'Open approval center' }
  }

  if (normalized.includes('zone')) {
    return { to: '/zones', label: 'Open operational zones' }
  }

  if (normalized.includes('vehicle') || normalized.includes('vt-')) {
    return { to: '/vehicle-modifications', label: 'Open vehicle tasks' }
  }

  if (normalized.includes('alarm plan') || normalized.includes('ap-')) {
    return { to: '/alarm-plans', label: 'Open alarm plans' }
  }

  return null
}
```

### Render pattern

```tsx
{notifications.map((item) => {
  const link = getNotificationLink(item.title, item.body)

  return (
    <li key={item.id}>
      <strong>{item.title}</strong>
      <p>{item.body}</p>
      {link ? (
        <Link to={link.to} className="dashboard-notification-link">
          {link.label} →
        </Link>
      ) : null}
    </li>
  )
})}
```

### Link styling

```css
.dashboard-notification-link {
  display: inline-flex;
  align-items: center;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  font-weight: 700;
}
```

> Implemented as `.dashboard-notification-link` in `src/App.css`. When reusing on another page, keep the `dashboard-notification-link` class (or clone it under a page-specific name with the same rules) so link spacing and weight stay consistent.

---

## 3) Recommended checklist when applying to another page

1. Identify the KPI card/chip selector for that page.
2. Add `display: block; text-align: center;` to the number element (`strong`, `h3`, etc.).
3. Add/extend a `getNotificationLink` helper for page-specific terms.
4. Render a conditional `<Link>` for each notification row.
5. Add a dedicated CSS class for link spacing and visual consistency.
6. Reuse shared utility classes for descriptive text and rounded chips/cards.
7. Ensure table header/body text keeps readable contrast and hierarchy.
8. Run:

```bash
npm run build
```

---

## 4) Reuse rounded-element and section-description utilities

### Goal
Keep rounded chips/cards and supporting description text visually consistent across modules.

### Utility classes

```css
.section-description {
  margin: 0.35rem 0 0;
  color: var(--muted-text);
  font-size: 0.92rem;
  line-height: 1.55;
}

.rounded-element {
  border: 1px solid var(--border-soft);
  border-radius: 0.8rem;
  background: linear-gradient(155deg, #ffffff 0%, #f8fbff 65%, #fff7f7 100%);
}
```

> **Important:** `.rounded-element` only supplies the border, radius, and background. It has **no padding and no internal layout** on its own. The chip layout (padding, `display: grid`, label/value stacking) comes from a container class such as `.dashboard-context-chips span` or `.identity-context-chips .rounded-element` in `src/App.css`. When reusing on a new page, wrap the chips in a layout container (or add the padding/grid rules to your own wrapper) — dropping a bare `.rounded-element` in will render an unpadded box.

### Markup pattern

```tsx
<p className="section-description">Core KPIs aligned with emergency planning requirements</p>

{/* The parent supplies padding + grid layout; .rounded-element supplies the surface. */}
<div className="dashboard-context-chips">
  <span className="rounded-element">
    Scope
    <strong>{scopeType} / {scopeValue}</strong>
  </span>
</div>
```

> In Dashboard this pattern is used for spotlight/supporting descriptions and top-right context chips (including Scope), always inside a `.dashboard-context-chips` (or equivalent) layout container.

---

## 5) Table text readability conventions

### Goal
Keep table text easy to scan while preserving clear hierarchy between header labels and row data.

### Recommended table text style (matches `src/App.css`)

```css
.table th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted-text);   /* theme-aware: rose / blue / green / amber per role */
  background: var(--border-soft);
}

.table td {
  color: #1f2937;             /* neutral slate, matches global body ink */
  line-height: 1.45;
  background: #ffffff;
}
```

### Practical guidance

1. Keep header labels compact and uppercase for fast column recognition.
2. Keep body text neutral and highly readable (avoid decorative colors in core data cells).
3. Use consistent row spacing/padding so dense operational tables remain scannable.
4. If role-based themes are active, drive header color from `var(--muted-text)` (and tints from `var(--border-soft)`) so headers follow the active theme instead of staying rose. Preserve contrast first; accents are secondary.

---

## 6) Current reference implementation

- `src/pages/Dashboard.tsx`
  - `getNotificationLink(...)`
  - conditional link render in **Latest notifications**
  - `.section-description` usage on descriptive copy
  - `.rounded-element` usage on context chips
- `src/App.css`
  - `.dashboard-hero-chips strong` (centered KPI number)
  - `.dashboard-notification-link` (notification cross-link style)
  - `.section-description` (shared description style)
  - `.rounded-element` (shared rounded surface — pair with a layout container for padding/grid)
  - `.table th` / `.table td` text hierarchy conventions (theme-aware header color via `var(--muted-text)`)
