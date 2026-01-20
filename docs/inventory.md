# PSR Training Academy - Codebase Inventory

Generated: 2026-01-20

## Route Structure

### App Routes (Next.js App Router)
- `/` - Landing page
- `/dashboard` - Main dashboard with stats and quick actions
- `/syllabus` - Syllabus map (topics by category)
- `/practice` - Practice mode (10/20/40 question sessions)
- `/mock-exam` - Timed exam simulation
- `/incidents` - Critical incident scenarios (CIT training)
- `/portfolio` - Portfolio workbook with reflection templates
- `/resources` - External resources and links
- `/coverage` - **NEW** Coverage Matrix (to be added)

### API Routes
- `POST /api/ai/generate-question` - AI question generation (OpenAI, server-side)
- `POST /api/ai/generate-scenario` - AI scenario generation
- `GET /api/health` - Health check
- `GET /api/self-test` - Self-test diagnostics

## UI Shell & Layout

### Components
- `AppShell` - Main layout wrapper (sidebar + header + content)
- `Sidebar` - Navy sidebar (260px), collapsible on mobile/tablet
- `Header` - Top bar with hamburger menu on mobile
- `PageHeader` - Consistent page title/description component
- `SectionCard`, `StatCard`, `EmptyState` - UI primitives

### Responsive Breakpoints (Tailwind)
- Mobile: < 640px (sm)
- Tablet: 640px - 1023px (md/lg)
- Laptop: 1024px+ (lg)
- Desktop: 1280px+ (xl), 1536px+ (2xl)

### Typography
- Base: 16px, line-height 1.6
- Body: 15px mobile, 16px desktop
- Headings: proper hierarchy
- Color tokens: navy/gold brand system

## Question Schema

Location: `/lib/schemas.ts`

```typescript
QuestionSchema = {
  id: string,
  topicId: string,
  difficulty: "foundation" | "intermediate" | "advanced",
  type: "mcq" | "best-answer" | "scenario" | "short-structured",
  stem: string,
  options?: [{ id: "A"|"B"|"C"|"D", text: string }],
  correct?: "A"|"B"|"C"|"D",
  explanation: string,
  references: [{ instrument, cite, note? }],
  pitfalls?: string[],
  tags?: string[]
}
```

## Content Structure

### Topics & Categories
Location: `/content/topics.json`
- 8 categories: pace-custody, vulnerability, interview, disclosure, bail, client-care, portfolio, evidence
- 20 topics mapped to categories

### Seeded Questions
Location: `/content/questions/*.json`
- core.json, pace.json, vulnerability.json, interview.json, disclosure.json
- evidence.json, bail.json, client-care.json, portfolio.json
- Exported via `/content/questions/index.ts`

### Scenarios
Location: `/content/scenarios.json`

## AI Integration

### Server-Side Only
- OpenAI client in `/lib/openai.ts`
- OPENAI_API_KEY from environment (never client-side)
- Rate limiting: 10 req/min per IP
- Caching: 1 hour TTL
- Fallback: seeded questions if AI fails

### Reference Suggestions
Location: `/lib/references/pace.ts`
- Curated fallback references by topic
- Practice tips by topic
- `isPaceCustodyTopic()` helper

## Testing Infrastructure

### Unit Tests (Vitest)
- `/tests/content.test.ts` - Content validation
- `/tests/schemas.test.ts` - Schema tests
- `/tests/utils.test.ts` - Utility tests

### E2E Tests (Playwright)
Location: `/tests/e2e/`
- `responsive.test.ts` - Viewport tests (4 sizes)
- `practice.test.ts` - Practice flow
- `navigation.test.ts` - Nav tests
- `api.test.ts` - API endpoint tests

### Viewports Configured
- Mobile: 390x844
- Tablet: 820x1180
- Laptop: 1366x768
- Desktop: 1440x900

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run check` - Lint + typecheck + build
- `npm run test` - Vitest unit tests
- `npm run e2e` - Playwright tests
- `npm run doctor` - Full quality gate (check + test + e2e + coverage)

## Upgrades Completed (2026-01-20)

1. **Standards Spine**: Created `/content/psras/standards.json` with 49 assessment criteria mapped to SRA PSRAS units/outcomes
2. **Coverage Matrix**: Added `/app/(app)/coverage/page.tsx` showing question coverage per criterion with color-coded status
3. **Authorities Engine**: Implemented `/lib/authorities/index.ts` with mandatory validation, URL generation, and GOV.UK link-outs
4. **Question Volume**: Expanded to 186 seeded questions across all core families (15+ per category)
5. **Link-outs**: All authorities now include clickable links to GOV.UK PACE Codes and legislation.gov.uk
6. **LAA Arrangements**: Added content about probationary constraints, DSCC, and deadlines from Police Station Register Arrangements 2025
7. **Authorities Panel**: Upgraded ReferencesPanel to AuthoritiesPanel with "Open" buttons, pitfalls, and "Why this matters" sections
8. **AI Generation**: Enhanced with standards spine integration and fallback authority attachment

### Files Added/Changed
- `/content/psras/standards.json` - NEW: 49 criteria, 68 expected authorities
- `/lib/authorities/index.ts` - NEW: Authorities engine with validation
- `/app/(app)/coverage/page.tsx` - NEW: Coverage Matrix page
- `/components/AuthoritiesPanel.tsx` - NEW: Enhanced authorities display
- `/scripts/import-psras-standards.mjs` - NEW: Standards validator
- `/content/questions/*-extended.json` - NEW: 96 additional questions
- `/lib/schemas.ts` - UPDATED: Extended reference instruments
- `/components/layout/Sidebar.tsx` - UPDATED: Added Coverage Matrix nav
- `/scripts/coverage-report.mjs` - UPDATED: New thresholds
- `/scripts/doctor.mjs` - UPDATED: Added coverage check
- `/tests/e2e/responsive.test.ts` - UPDATED: New coverage/authorities tests
