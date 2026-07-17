# IndustrialIQ \u2013 Refactored Architecture

This is the same IndustrialIQ application, refactored from a single 1000+ line
component into a modular, production-style React project. UI, layout, copy,
and behavior are unchanged \u2014 only the architecture changed.

## Structure

```
src/
  constants/    Static data (colors, roles, plants, nav, graph, docs, etc.) \u2014 zero large arrays live in components
  services/     Data-access layer. Every function is async and currently returns mock data.
                Replace the body of any function with an axios call to swap in the real
                FastAPI backend without touching a single component.
  hooks/        useAuth, useKnowledgeGraph, useStreamingText
  components/
    common/     Card, Badge, MetricCard, SectionTitle, Button, Input, IconButton,
                EmptyState, LoadingSpinner \u2014 reused across every page
    layout/     Sidebar, TopBar, AppShell
    graph/      KnowledgeGraphPanel (the always-visible live graph) + explorer pieces
    auth/       LoginScreen, RoleSelector
    dashboard/  copilot/  documents/  maintenance/  compliance/  analytics/  admin/
  pages/        One page per nav item, composes feature components + services
  App.jsx       Routing (simple state-based switch) and top-level state wiring
```

## Backend integration

Every file in `src/services/` has `// TODO(backend)` comments showing the exact
axios call to drop in. Example:

```js
// before
export const getDocuments = async () => DOCUMENTS;

// after
export const getDocuments = async () => {
  const { data } = await axios.get("/api/documents");
  return data;
};
```

No component imports mock data directly \u2014 they all go through `services/`, so this
swap is a one-line change per function.

## Styling

All inline style objects were converted to Tailwind utility classes. Custom brand
colors (navy, primary, success, warning, danger, purple, etc.) are registered in
`tailwind.config.js` so components use semantic classes like `bg-navy` or
`text-primary` instead of raw hex codes. The handful of remaining inline `style`
attributes are for values that must be computed at runtime (dynamic grid-template
columns, SVG node coordinates, conic health rings) \u2014 these cannot be expressed as
static Tailwind classes.

## Run it

```
npm install
npm run dev
```
