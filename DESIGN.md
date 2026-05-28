# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-05-28
- Primary product surfaces: Pando CRM Admin V1 static publishing prototype under `v1-publishing/`.
- Evidence reviewed:
  - `share/docs4/V1_INDEX.md` — V1 scope and section inventory.
  - `share/docs4/V1/D01-공통/공통.md` — login, notifications, session expiry.
  - `share/docs4/V1/D02-회원관리/회원관리.md` — member list/registration/detail and dialogs.
  - `share/docs4/V1/D03-매출관리/매출관리.md` — sales, POS, payment/refund flows.
  - `share/docs4/_공통/디자인_시스템.md` — dense admin UI, tables/filters/status badges over decorative cards.
  - `v1-publishing/components/prototype-app.tsx` — current screen shell and mock interaction implementation.
  - `v1-publishing/app/globals.css` and `components/ui/*` — shadcn-style component primitives.

## Brand
- Personality: operational, reliable, high-density, back-office first.
- Trust signals: screen/document IDs, role and branch context, explicit policy-pending badges, stable table layouts, audit/action contract notes.
- Avoid: marketing landing-page styling, oversized cards that hide operational data, decorative-only controls, generic one-template screens.

## Product goals
- Goals:
  - Let a development vendor understand every V1 admin screen, route, dialog, state, and action handoff.
  - Make core operations visually believable enough for stakeholder walkthroughs.
  - Preserve API/DB/external integration exclusions while showing mock UI feedback for every control.
- Non-goals:
  - Real payment/refund/SMS/Kakao/IoT execution.
  - Backend data modeling or production authentication.
- Success signals:
  - D01~D11 route/dialog coverage remains 100%.
  - D01~D03 core screens use document-shaped dedicated layouts.
  - D04~D11 at least use domain-specific operation layouts, not a single generic template.

## Personas and jobs
- Primary personas: HQ admin, Owner/지점장, Manager, FC, Trainer, Staff.
- User jobs: locate urgent work, filter dense operational tables, open related dialogs, understand permission limits, hand off exact API/action contracts to developers.
- Key contexts of use: desktop admin, high-frequency center operations, multi-branch oversight, policy review.

## Information architecture
- Primary navigation: left sidebar grouped by docs4 domain D01~D11.
- Core routes/screens: `/login`, `/notifications`, `/members`, `/members/new`, `/members/detail`, `/sales`, `/sales/pos`, `/sales/payment`, plus all V1 SCR routes.
- Content hierarchy: document ID/status → purpose → KPI/operational focus → filters/tabs → dense table/board → action queue/dialogs → handoff contract.

## Design principles
- Principle 1: Every visible control must do something at publishing level: toast, local state, modal, route, or permission feedback.
- Principle 2: Tables, filters, badges, and queues are primary; cards summarize but do not replace operational lists.
- Principle 3: Role and policy differences must be visible rather than silently hidden when useful for QA.
- Tradeoffs: D04~D11 use reusable domain operation patterns until each screen receives a fully bespoke pass.

## Visual language
- Color: slate admin shell with domain accent gradients; blue/emerald/amber/violet/pink/indigo/cyan for domain identity; amber for policy pending; red for destructive/risk.
- Typography: system sans, compact sizes, bold labels for scan targets.
- Spacing/layout rhythm: 6px/8px compact rhythm, dense panels, sticky topbar/sidebar, two-column content + right action rail.
- Shape/radius/elevation: rounded-xl panels, low shadow, strong borders; no heavy glassmorphism except login hero.
- Motion: minimal hover lift/feedback only; avoid distracting motion.
- Imagery/iconography: lucide icons for navigation/security/status only; no stock imagery.

## Components
- Existing components to reuse: shadcn-style `Button`, `Badge`, `Card`, `Dialog`, `Input`, `Select`, `Table`, `Tabs`, `Textarea`.
- New/changed components: dedicated operational screen sections in `PrototypeApp`, `DomainOperationsScreen`, `DialogDock`, `HandoffContractCard`, `DeliveryHeader`.
- Variants and states: default/outline/destructive buttons; success/warning/info badges; blocked permission state via toast; policy-pending badge.
- Token/component ownership: `app/globals.css` owns global visual polish; `components/ui/*` stays primitive and reusable.

## Accessibility
- Target standard: practical WCAG AA for admin prototype.
- Keyboard/focus behavior: native buttons/inputs/selects; visible focus ring via shadcn button classes.
- Contrast/readability: dark sidebar and white cards with high contrast; warning/destructive states use text plus color.
- Screen-reader semantics: buttons remain buttons; tables use table markup; dialogs use Radix dialog primitives.
- Reduced motion and sensory considerations: only subtle hover/transition; no required animation.

## Responsive behavior
- Supported breakpoints/devices: desktop-first admin; 1366px+ primary. Tablet should scroll horizontally where needed.
- Layout adaptations: sidebar + main grid on desktop; dense tables may overflow within bordered containers.
- Touch/hover differences: hover is enhancement, not required for operation.

## Interaction states
- Loading: represented in contracts and status cards; skeleton areas reserved in board/table regions.
- Empty: table/search none copy and action hint.
- Error: toast and inline warning states for validation/policy/external integration.
- Success: toast and local state changes.
- Disabled: use only when the workflow genuinely cannot proceed; otherwise show blocked feedback.
- Offline/slow network: real network excluded; UI copy marks external integration pending where relevant.

## Content voice
- Tone: direct Korean operational microcopy.
- Terminology: follow docs4 labels: 회원, 매출, 수업, 상품, 지점, 권한, 정책 확인 필요, mock.
- Microcopy rules: state what happened and what is excluded; avoid pretending real backend work occurred.

## Implementation constraints
- Framework/styling system: Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn-style primitives.
- Design-token constraints: use existing CSS variables and Tailwind utility classes; no new dependency unless explicitly requested.
- Performance constraints: static export/build must pass; all data local mock.
- Compatibility constraints: avoid hydration mismatch from browser storage; use deterministic server snapshots.
- Test/screenshot expectations: `npm run build`, `npm run test:e2e`, coverage/handoff verification; Playwright screenshots for visual smoke.

## Open questions
- [ ] Exact brand assets/logo beyond text “Pando” / owner: client / impact: visual polish.
- [ ] Whether D04~D11 require full bespoke screen-by-screen publishing or domain-template acceptable for first delivery / owner: client / impact: schedule and fidelity.
- [ ] Mobile/tablet support expectations for admin / owner: client / impact: responsive implementation.
