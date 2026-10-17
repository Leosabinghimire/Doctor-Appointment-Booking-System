# MediCare+ — Healthcare Dashboard

A modern, professional **Online Doctor Appointment & Healthcare Dashboard** built with React, TypeScript, and Material UI. Designed as a production-grade frontend reference and portfolio piece.

## Features

- **Patient Dashboard** — health overview, vitals, heart-rate trends, upcoming visits, recent activity
- **Doctor Listings** — searchable, filterable directory with rating/fee/specialty/availability filters
- **Doctor Detail** — profile, reviews, languages, hospitals, schedule
- **Appointment Booking** — multi-step stepper (doctor → slot → details → confirm) with animated transitions
- **Appointments** — upcoming/completed/cancelled tabs, cancel-with-confirm, join video link
- **Medical History** — vertical timeline with diagnoses, symptoms, treatments
- **Prescriptions** — active/past, refill flow, export action, search
- **Video Consultation UI** — live call simulation with mic/cam/screen-share/chat
- **Notifications** — typed notifications with read state and bulk-mark-read
- **Admin Dashboard** — KPI cards, weekly bookings bar chart, specialty pie chart, top doctors, recent sign-ups
- **Dark / Light Mode** — animated toggle, persisted via Zustand
- **Smooth Animations** — Framer Motion route transitions, card entrance animations, theme toggle morph
- **Loading States** — skeleton grids, spinner loaders, optimistic UX
- **Responsive** — mobile drawer, sticky topbar, fluid grids
- **API-ready** — Axios client, interceptors, mock layer with `fakeDelay` swap

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for tooling
- **Material UI v6** + custom theme + gradients
- **TanStack Query v5** for data fetching/caching
- **Axios** with auth/error interceptors
- **Zustand** (theme, auth, ui) with persistence
- **React Router v6** with nested layout routes
- **Recharts** for analytics
- **Framer Motion** for animations
- **date-fns** for date formatting

## Project Structure

Clean, layered architecture — every concern lives in its own top-level folder, every folder ships a barrel `index.ts`, and every page heavier than ~150 lines is split into focused sub-components and a co-located feature hook.

```
src/
├── api/
│   ├── client/                  # Axios instance, auth/error interceptors, mock fakeDelay
│   ├── endpoints/               # URL constants per resource (single source of truth)
│   └── services/                # Pure async functions consuming endpoints
├── config/                      # APP_NAME / APP_DEFAULTS · env.ts (VITE_API_URL, USE_MOCK)
├── constants/                   # Domain constants — specialties, cities, ROUTES, ROUTE_PATTERNS
├── lib/                         # Cross-cutting infra
│   ├── queryClient.ts           # QueryClient instance
│   ├── queryKeys.ts             # Hierarchical, type-safe query keys
│   └── animations.ts            # Reusable Framer Motion variants (fadeInUp, popIn, …)
├── theme/                       # MUI theme — split into tokens
│   ├── tokens/                  # palette · typography · shape · components overrides
│   └── createAppTheme.ts        # mode → Theme builder
├── store/                       # Zustand — per-domain folders + selector hooks
│   ├── auth/  (auth.store.ts · auth.selectors.ts)
│   ├── theme/ (theme.store.ts · useThemeMode/useThemeActions)
│   └── ui/    (ui.store.ts)
├── types/                       # Domain types — *.types.ts + common.types.ts
├── hooks/                       # TanStack Query hooks per domain (doctors/, appointments/, …, common/)
├── data/                        # Mock data backing the service layer
├── utils/                       # Pure helpers (format.ts)
│
├── components/                  # Reusable presentational components
│   ├── ui/                      # Atomic primitives (PageHeader, StatCard, SectionCard,
│   │                            #   Loader, EmptyState, ConfirmDialog, ThemeToggle,
│   │                            #   StatusChip, InfoRow, SummaryRow)
│   ├── doctor/                  # DoctorCard, DoctorFilters
│   ├── appointment/             # AppointmentCard, TimeSlotPicker
│   ├── prescription/            # PrescriptionCard
│   └── notification/            # NotificationItem
│
├── layouts/                     # Top-level shell components (NOT in components/)
│   ├── AppLayout.tsx            # Sidebar + TopBar + animated <Outlet/>
│   ├── Sidebar/                 # BrandHeader · NavList · HelpCard · Sidebar
│   ├── TopBar/                  # GlobalSearch · NotificationsButton · UserMenu · TopBar
│   └── navItems.ts              # Route-driven nav config
│
├── providers/                   # Composition root for context
│   ├── AppQueryProvider.tsx     # QueryClientProvider + Devtools
│   ├── AppThemeProvider.tsx     # MUI ThemeProvider + CssBaseline
│   ├── AppRouterProvider.tsx    # BrowserRouter
│   ├── ErrorBoundary.tsx        # Top-level error boundary with reset
│   └── AppProviders.tsx         # Composes all providers in correct order
│
├── routes/                      # AppRoutes — the route table, driven by ROUTES constants
│
├── pages/                       # Route-level pages
│   ├── Dashboard/               # ┐
│   │   ├── Dashboard.tsx        # │ Page = composition only.
│   │   ├── PatientHeroCard.tsx  # │ Sections live as siblings.
│   │   ├── DashboardStats.tsx   # │
│   │   ├── HeartRateCard.tsx    # │
│   │   ├── VitalsCard.tsx       # │
│   │   ├── UpcomingAppointmentsCard.tsx
│   │   ├── RecentActivityCard.tsx
│   │   ├── dashboard.data.ts    # │ Local mock data (chart series, vitals)
│   │   └── index.ts             # ┘
│   ├── BookAppointment/
│   │   ├── BookAppointment.tsx
│   │   ├── BookingSummary.tsx
│   │   ├── useBookingFlow.ts    # ← Feature hook — extracts ALL stepper state
│   │   └── steps/               # DoctorSelect · SlotSelect · PatientDetails · Confirm
│   ├── VideoConsultation/
│   │   ├── VideoConsultation.tsx
│   │   ├── VideoStage.tsx · ControlBar.tsx · ChatPanel.tsx · NotesCard.tsx
│   │   ├── useCallTimer.ts      # ← Self-contained 1-second timer hook
│   │   └── useChat.ts           # ← Self-contained chat state hook
│   ├── AdminDashboard/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminStatsGrid.tsx · WeeklyAppointmentsChart.tsx
│   │   ├── SpecialtyDistributionChart.tsx
│   │   └── TopDoctorsList.tsx · RecentSignupsList.tsx
│   ├── Doctors.tsx · DoctorDetail.tsx · Appointments.tsx
│   ├── MedicalHistory.tsx · Prescriptions.tsx · Notifications.tsx · NotFound.tsx
│   └── index.ts                 # Barrel for AppRoutes
│
├── App.tsx                      # 7 lines: AppProviders → AppRoutes
└── main.tsx                     # createRoot(<App/>)
```

### Architectural Layers

| Layer | Responsibility | Example |
| --- | --- | --- |
| `api/client/` | Single Axios instance + auth/error interceptors | `axiosClient.get(...)` |
| `api/endpoints/` | URL constants — single source of truth | `DOCTOR_ENDPOINTS.detail(id)` |
| `api/services/` | Pure async functions calling endpoints; no React | `doctorsService.list(filters)` |
| `lib/queryKeys.ts` | Hierarchical, type-safe query keys | `queryKeys.doctors.detail(id)` |
| `lib/animations.ts` | Reusable Framer Motion variants | `<motion.div variants={fadeInUp} />` |
| `hooks/<domain>/` | TanStack Query hooks wrapping services | `useDoctor(id)` |
| `store/<domain>/` | Zustand slices + selector hooks | `useThemeMode()` · `useCurrentUser()` |
| `theme/tokens/` | Design tokens (palette, typography, shape, components) | `createAppTheme('dark')` |
| `providers/` | Composition root — every context provider in one place | `<AppProviders>{children}</AppProviders>` |
| `layouts/` | Page chrome (sidebar, topbar, outlet) | `<AppLayout/>` |
| `constants/routes.ts` | Centralised route paths + URL builders | `ROUTES.doctorDetail(id)` |
| `pages/` | Route-level composition only — no business logic, no Axios | `<Dashboard/>` |
| `components/` | Reusable presentational components | `<StatCard label="..." />` |

### Conventions

- **Import order**: external libs → `@/api` → `@/lib` / `@/store` / `@/hooks` → `@/components` → `./relative`
- **Path alias**: `@/*` maps to `src/*` (mirrored in [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json))
- **Barrels**: every folder exports through `index.ts` — consumers import from the folder, not the file
- **Selectors over state**: prefer `useThemeMode()` over `useThemeStore(s => s.mode)` at call sites
- **Routes as data**: never hardcode paths — use `ROUTES.appointments` or `ROUTES.bookWithDoctor(id)`
- **Pages are thin**: page files compose section components and feature hooks; logic moves to `useBookingFlow`, `useCallTimer`, etc.
- **One animation source**: import variants from `@/lib/animations` instead of inlining `initial`/`animate` props

### Swap mock → real API

Every service checks `env.useMockApi` and calls the real backend through Axios when it is off:

```ts
// src/api/services/doctors.service.ts
list: async (filters?: DoctorFilters): Promise<Doctor[]> => {
  if (!env.useMockApi) {
    const { data } = await axiosClient.get<Doctor[]>(DOCTOR_ENDPOINTS.list, { params: filters });
    return data;
  }
  return fakeDelay(applyFilters(mockDoctors, filters), 400);
},
```

Set `VITE_USE_MOCK=false` (see [Backend](#backend-server)) — components and hooks need no changes.

## Getting Started

### Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| **Node.js** | ≥ 18.18 (LTS recommended: 20.x) | Required by Vite 5 and @vitejs/plugin-react |
| **npm** | ≥ 9 | Comes with Node 18+. `pnpm` and `yarn` work too |
| **Git** | any | Optional — only needed to clone |

Verify your environment:

```bash
node --version    # v18.18+ or v20.x
npm --version     # 9.x+
```

### 1. Get the code

```bash
git clone <your-repo-url> medicare-plus
cd medicare-plus
```

Or download the project folder and open a terminal inside it.

### 2. Install dependencies

```bash
npm install
```

This installs everything declared in [`package.json`](package.json) — React 18, MUI v6, TanStack Query v5, Axios, Zustand, React Router v6, Recharts, Framer Motion, date-fns, plus the Vite + TypeScript dev tooling.

### 3. Configure environment variables

The app ships with a working **mock data layer**, so it runs out of the box. To customize, copy `.env.example`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Then edit `.env.local`:

```env
VITE_API_URL=https://api.your-domain.com/v1
VITE_USE_MOCK=true
```

> Vite only exposes variables prefixed with `VITE_` to the client. They're typed in [src/vite-env.d.ts](src/vite-env.d.ts) and consumed via [src/config/env.ts](src/config/env.ts).

### 4. Run the dev server

```bash
npm run dev
```

Vite starts on **http://localhost:5173** with HMR enabled. The browser opens automatically (configured via `server.open: true` in [vite.config.ts](vite.config.ts)).

If port 5173 is taken, Vite prints the next available port. To force a different port:

```bash
npm run dev -- --port 3000
```

### 5. Build for production

```bash
npm run build      # Type-checks then bundles to dist/
npm run preview    # Serves the production build locally on :4173
```

### 6. Type-check only

```bash
npm run lint       # Runs `tsc --noEmit` (no JS output, just type checking)
```

### Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR on port 5173 |
| `npm run build` | Type-check via `tsc -b` then bundle with Vite into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |

### Vite configuration

Defined in [vite.config.ts](vite.config.ts):

```ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),   // Enables @/components/... imports
    },
  },
  server: {
    port: 5173,
    open: true,                                 // Auto-opens browser on `npm run dev`
  },
});
```

The `@/*` path alias is mirrored in [tsconfig.json](tsconfig.json) under `compilerOptions.paths`, so both Vite and `tsc` resolve imports identically.

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| `EACCES` / permission errors on install | Avoid `sudo`; use a Node version manager (nvm/fnm/Volta) |
| Stale errors after pulling new code | Delete `node_modules` + `package-lock.json`, then `npm install` |
| Port 5173 already in use | `npm run dev -- --port 3000` or kill the process on that port |
| Browser doesn't auto-open | Visit http://localhost:5173 manually |
| `Cannot find module '@/...'` in editor | Restart TS server (VS Code: ⇧⌘P → "TypeScript: Restart TS Server") |
| Theme/auth state stuck | Clear localStorage — Zustand persists `medicare-theme` and `medicare-auth` |

## API Integration

The mock layer in [src/api/services/](src/api/services/) matches the shape of the REST backend in [server/](server/). Each service returns mock data when `VITE_USE_MOCK=true` and calls the backend through Axios when it is `false`.

Hooks ([useDoctors](src/hooks/doctors/useDoctors.ts), [useAppointments](src/hooks/appointments/useAppointments.ts), …) and UI components require **no changes** — they only see the service interface.

## Backend server

[server/](server/) is a Node.js + TypeScript (Express) REST API implementing every endpoint in [src/api/endpoints/](src/api/endpoints/), backed by a **SQLite** database.

### Database

- **File:** `server/data/medicare.db` (created on first start; change with `DATABASE_PATH`). It's git-ignored — **back this file up**; it holds all patient data.
- **Schema:** [server/src/db/migrations.ts](server/src/db/migrations.ts). Migrations run automatically on start and are tracked with SQLite's `user_version`. To change the schema, append a new migration — never edit a shipped one.
- **Data access:** one repository per area in [server/src/repos/](server/src/repos/). Routes never write SQL directly.
- **Seed data:** on an empty database the server adds the doctor catalog and the admin account. In development it also adds the demo patient (Alex Morgan) with sample appointments, prescriptions and calls. Production gets no demo data.
- **Double booking** is blocked by a unique index in the database (`409 SLOT_TAKEN`), so it holds even under simultaneous requests.
- **Availability** is computed from the clinic schedule (09:00–17:00, Monday–Saturday, next 7 days) minus booked appointments and past times.
- **Admin dashboard numbers** are computed live from the database.
- **Start fresh:** stop the server and delete the `server/data` folder.

```bash
npm run server:install     # once
npm run server             # http://localhost:4000/v1  (in a second terminal)
```

Then point the frontend at it in `.env.local` and restart `npm run dev`:

```env
VITE_API_URL=http://localhost:4000/v1
VITE_USE_MOCK=false
```

## Login & roles

Every page except `/login` requires signing in. The backend checks every request — the frontend guards are only for navigation.

| Role | Sees | Can do |
| --- | --- | --- |
| **Patient** | Only their own appointments, prescriptions, history, notifications | Book / cancel their own appointments |
| **Admin** | All appointments, admin dashboard, call logs | Book for any patient, trigger Telentir syncs and reminder calls |

- Passwords are hashed with scrypt; sessions are signed JWTs (`Authorization: Bearer …`), valid for `JWT_EXPIRES_IN` (default 8h).
- 5 failed logins for the same email + IP lock that combination for 15 minutes.
- Patients sign up on the login page. Admin accounts are not self-service — the first admin comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**Development accounts** (seeded only when `NODE_ENV` is not `production`):

| Email | Password | Role |
| --- | --- | --- |
| `alex.morgan@example.com` | `patient-dev-password` | Patient |
| `admin@medicare.example` | `admin-dev-password` | Admin |

In development a random JWT secret is generated once and kept in `server/data/.dev-jwt-secret`, so sign-ins survive restarts. In production, set `JWT_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` — the server refuses to start without them. The admin account is created only once; changing `ADMIN_PASSWORD` later does not change an existing admin's password.

## Telentir AI voice agent

The backend integrates [Telentir](https://docs.telentir.com) via its official SDK (`@silyze/telentir-sdk`). The API key stays on the server; the browser only talks to our REST API.

| Feature | How | Where |
| --- | --- | --- |
| **Call logs** | Polls `telentir.calls.all()` (every `TELENTIR_SYNC_INTERVAL_SEC`) and decrypts transcripts | `/calls` page · [server/src/telentir/calls.ts](server/src/telentir/calls.ts) |
| **Reminder calls** | `telentir.sessions.call()` with a reminder prompt for the appointment | Phone icon on upcoming appointments · [reminders.ts](server/src/telentir/reminders.ts) |
| **Clinic knowledge base** | Uploads the doctor directory so inbound callers can ask about doctors, fees, visit types | `npm --prefix server run telentir:knowledge` · [knowledge.ts](server/src/telentir/knowledge.ts) |

Setup:

1. Copy `server/.env.example` to `server/.env`.
2. Create an API key in the Telentir dashboard → `TELENTIR_API_KEY`.
3. Create an AI agent in Telentir → `TELENTIR_AGENT_ID`.
4. Optionally run `npm --prefix server run telentir:knowledge` and set the printed `TELENTIR_KNOWLEDGE_BASE_ID`; attach it to your inbound configuration in the Telentir dashboard.
5. Restart the server. Without a key, everything else works and the Call Logs page shows demo calls.

**Not supported yet:** Telentir's docs do not describe a way for the agent to call our API mid-call, so phone callers can't book directly into this system. The agent answers questions and requests staff callbacks; bookings happen in the app. The transcript format is also undocumented, so [normalizeTranscript](server/src/telentir/calls.ts) accepts the likely shapes — verify it against a real call.

## Routes

| Path | Page |
| --- | --- |
| `/login` | Sign in / create account (public) |
| `/` | Patient Dashboard |
| `/doctors` | Doctor Listings |
| `/doctors/:id` | Doctor Detail |
| `/book` / `/book/:doctorId` | Appointment Booking |
| `/appointments` | My Appointments |
| `/history` | Medical History |
| `/prescriptions` | Prescriptions |
| `/video` / `/video/:appointmentId` | Video Consultation |
| `/notifications` | Notifications |
| `/admin` | Admin Dashboard |
| `/calls` | Call Logs (Telentir) |

## Design Notes

- Card-based UI with subtle gradients, layered shadows, and hover lifts
- Healthcare palette: cyan/sky primary, violet secondary, semantic statuses
- Typography pair: Plus Jakarta Sans (display) + Inter (body)
- All interactive cards animate on entrance with staggered Framer Motion delays
- Page transitions use `AnimatePresence` keyed on `pathname`

---

Built as a portfolio-grade reference. Replace the mock layer with your backend and ship.
