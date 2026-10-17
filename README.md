# MediCare+ — Doctor Appointment Booking System

A full-stack **online doctor appointment and clinic management app**. Patients find doctors and book visits; clinic admins manage doctors, see every booking, and track phone calls handled by an AI voice agent.

- **Frontend:** React 18, TypeScript, Material UI, TanStack Query
- **Backend:** Node.js, TypeScript, Express, SQLite
- **Login:** patient and admin accounts with hashed passwords and signed sessions
- **Optional:** [Telentir](https://docs.telentir.com) AI voice agent for reminder calls and call logs

## Quick start

You need **Node.js 20.12 or newer** (22 LTS recommended) and npm.

```bash
# 1. Install the frontend and the backend
npm install
npm run server:install

# 2. Point the frontend at the local backend
cp .env.example .env.local            # Windows PowerShell: Copy-Item .env.example .env.local
#    then set in .env.local:  VITE_USE_MOCK=false

# 3. Start both (two terminals)
npm run server                        # backend  → http://localhost:4000/v1
npm run dev                           # frontend → http://localhost:5173
```

Open http://localhost:5173 and sign in with a development account:

| Email | Password | Role |
| --- | --- | --- |
| `alex.morgan@example.com` | `patient-dev-password` | Patient (has sample appointments and prescriptions) |
| `admin@medicare.example` | `admin-dev-password` | Admin |

Or create a new patient account with **Create account** on the login page.

> **Frontend only?** Leave `VITE_USE_MOCK=true` (the default) and run just `npm run dev`. The app then uses built-in sample data and doesn't need the backend. Changes are lost on page reload.

## Features

### For patients
- **Find doctors** — search and filter by specialty, city, fee, visit type and availability today
- **Doctor profiles** — qualifications, hospital, languages, fees, and the real next open slot
- **Book appointments** — pick a doctor, day and time slot, then confirm. A slot can never be booked twice
- **My appointments** — upcoming, completed and cancelled visits; cancel an upcoming visit
- **Dashboard** — next appointment, upcoming and completed visits, active prescriptions, recent notifications
- **Medical history and prescriptions** — read-only records for the signed-in patient
- **Notifications** — e.g. "Appointment confirmed" after booking; mark as read

### For admins
- **Admin dashboard** — live totals (patients, doctors, today's bookings, revenue this month), bookings per day, specialty mix, newest sign-ups
- **All appointments** — every booking across the clinic
- **Manage doctors** — add, edit, archive and restore doctors
- **Call logs** — phone calls handled by the Telentir AI agent, with transcripts
- **Reminder calls** — have the AI agent phone a patient about an upcoming appointment (needs Telentir)

### Everywhere
- Light and dark mode, responsive layout with a mobile menu, loading and empty states, smooth page transitions

## Not built yet

These parts of the interface are placeholders. They're listed here so nobody mistakes them for working features:

| Item | Status |
| --- | --- |
| **Video consultation** | UI simulation only — no real video or audio call happens |
| **Request refill** / **Export** buttons on prescriptions | Buttons do nothing yet |
| Search bar at the top of every page | Does nothing yet (use **Find Doctors** to search) |
| **Settings** in the user menu | Does nothing yet |
| Editing your profile | Profile is read-only |
| Email / SMS confirmations | Not sent — confirmations appear in **Notifications** |
| Doctor reviews and ratings | No review system; new doctors show **New** |
| Doctor photos | Pasted as a web link; no file upload |
| Per-doctor schedules | Every doctor works 09:00–17:00, Monday–Saturday |
| Booking by phone through the AI agent | Not possible with Telentir's documented API (see [Telentir](#telentir-ai-voice-agent)) |

## Login and roles

Every page except `/login` requires signing in. **The backend checks permissions on every request**; the frontend only hides links.

| Role | Sees | Can do |
| --- | --- | --- |
| **Patient** | Only their own appointments, prescriptions, history and notifications | Book and cancel their own appointments |
| **Admin** | All appointments, admin dashboard, doctor management, call logs | Book for any patient, manage doctors, trigger Telentir syncs and reminder calls |

- Passwords are hashed with scrypt. Sessions are signed JWTs, valid for 8 hours by default (`JWT_EXPIRES_IN`).
- After 5 wrong passwords for the same email from the same IP address, that combination is locked for 15 minutes.
- Patients sign up themselves. Admin accounts can't be created from the app — the first admin comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, and is created only once (changing `ADMIN_PASSWORD` later does not change an existing admin's password).
- The development accounts above exist only when `NODE_ENV` is not `production`.

## Managing doctors

Admins manage doctors at **Manage Doctors** (`/manage-doctors`).

- **Archive instead of delete.** Archived doctors disappear from patient search and booking, but past and already-booked appointments are kept. The archive dialog shows how many upcoming visits the doctor still has, so you can contact those patients. Archived doctors can be restored.
- **Checked on the server:** required fields, a specialty from the list, experience 0–70 years, fee 0–10,000, at least one language, at least one visit type (video / in-person), and photo links must start with `https://`. All problems are reported together.
- **Computed, not typed:** "Next available" and "Available today" come from the real schedule and existing bookings.
- The Find Doctors city list and fee slider are built from your actual doctors, so nobody is hidden by a fixed list.
- **Production starts with no doctors.** The 10 sample doctors are added only in development.

## Database

The backend stores everything in **SQLite** — a single file, nothing to install.

- **File:** `server/data/medicare.db`, created on first start (change with `DATABASE_PATH`). It's excluded from git. **Back this file up — it holds all patient data.**
- **Start fresh:** stop the backend and delete the `server/data` folder. On the next start you get an empty database (plus sample data in development).
- **Schema changes** live in [server/src/db/migrations.ts](server/src/db/migrations.ts) and run automatically on start. To change the schema, add a new migration at the end — never edit one that has already shipped.
- **Double booking** is blocked by a unique index in the database, so it holds even when two people click at the same moment (the second gets `409 SLOT_TAKEN`).
- **Availability** = the clinic schedule (09:00–17:00, Monday–Saturday, next 7 days) minus booked slots and times that have already passed.

## Telentir AI voice agent

Optional. Without it, everything else works and the Call Logs page shows sample calls.

The backend uses Telentir's official SDK (`@silyze/telentir-sdk`). The API key stays on the server; the browser never sees it.

| Feature | How it works |
| --- | --- |
| **Call logs** | The backend pulls call history from Telentir every 60 seconds (`TELENTIR_SYNC_INTERVAL_SEC`), or when an admin clicks **Sync from Telentir** |
| **Reminder calls** | An admin clicks the phone icon on an upcoming appointment; the AI agent calls the patient with the appointment details |
| **Clinic knowledge base** | `npm --prefix server run telentir:knowledge` uploads the doctor list so the agent can answer callers' questions about doctors, fees and visit types |

**Setup**

1. Copy `server/.env.example` to `server/.env`.
2. In the Telentir dashboard: create an API key, connect a phone number, and create an AI agent.
3. In `server/.env`, set `TELENTIR_API_KEY` and `TELENTIR_AGENT_ID`.
4. Optional: run `npm --prefix server run telentir:knowledge`, put the printed `TELENTIR_KNOWLEDGE_BASE_ID` in `server/.env`, and attach the knowledge base to your inbound configuration in Telentir.
5. Restart the backend.

**Limits.** Telentir's documentation doesn't describe a way for the agent to call our API during a call, so phone callers can't book directly into this system. The agent answers questions and asks staff to call back; bookings happen in the app. The transcript format is also undocumented — check the first real transcript and adjust `normalizeTranscript` in [server/src/telentir/calls.ts](server/src/telentir/calls.ts) if needed.

## Configuration

### Frontend — `.env.local`

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000/v1` | Where the backend is |
| `VITE_USE_MOCK` | `true` | `true` = built-in sample data, no backend. `false` = use the backend |

### Backend — `server/.env`

Copy [server/.env.example](server/.env.example). All values are optional in development.

| Variable | Needed in production | Meaning |
| --- | --- | --- |
| `PORT` | | Backend port (default `4000`) |
| `CORS_ORIGIN` | ✔ | Web address(es) of the frontend, comma-separated |
| `DATABASE_PATH` | | SQLite file (default `server/data/medicare.db`) |
| `JWT_SECRET` | ✔ | Long random string that signs sessions |
| `JWT_EXPIRES_IN` | | Session length (default `8h`) |
| `ADMIN_EMAIL` | ✔ | Email of the first admin account |
| `ADMIN_PASSWORD` | ✔ | Password of the first admin account |
| `TELENTIR_API_KEY`, `TELENTIR_AGENT_ID`, `TELENTIR_KNOWLEDGE_BASE_ID`, `TELENTIR_SYNC_INTERVAL_SEC` | | See [Telentir](#telentir-ai-voice-agent) |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Before going live

With `NODE_ENV=production`, the backend **refuses to start** unless `JWT_SECRET` and `ADMIN_PASSWORD` are set, and it adds no sample doctors or demo accounts. In addition:

- [ ] Serve the frontend and backend over **HTTPS** only
- [ ] Set `CORS_ORIGIN` to your real frontend address
- [ ] Back up `server/data/medicare.db` automatically, and test restoring it
- [ ] Add your real doctors in **Manage Doctors**
- [ ] If you handle real US patient data: confirm HIPAA requirements, and get a Business Associate Agreement (BAA) from Telentir before enabling it
- [ ] Review the [Not built yet](#not-built-yet) list — hide placeholder buttons you don't want patients to see

Build the frontend with `npm run build` (output in `dist/`) and serve it with any static web server. Start the backend with `NODE_ENV=production npm --prefix server start`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the frontend on http://localhost:5173 |
| `npm run build` | Type-check and build the frontend into `dist/` |
| `npm run preview` | Serve the built frontend locally |
| `npm run lint` | Type-check the frontend |
| `npm run server:install` | Install the backend's packages |
| `npm run server` | Start the backend on http://localhost:4000 (restarts on code changes) |
| `npm --prefix server start` | Start the backend without auto-restart |
| `npm --prefix server run lint` | Type-check the backend |
| `npm --prefix server run telentir:knowledge` | Upload the doctor list to a Telentir knowledge base |

## Project structure

```
├── src/                         # Frontend (React)
│   ├── api/
│   │   ├── client/              # Axios instance; adds the login token, signs out on expired sessions
│   │   ├── endpoints/           # Backend URL paths, one file per area
│   │   └── services/            # Calls the backend — or returns sample data when VITE_USE_MOCK=true
│   ├── hooks/                   # TanStack Query hooks per area (doctors, appointments, auth, admin, calls, …)
│   ├── pages/                   # One folder or file per page
│   │   ├── Login/               # Sign in / create account
│   │   ├── Dashboard/           # Patient dashboard
│   │   ├── BookAppointment/     # Booking steps + useBookingFlow hook
│   │   ├── AdminDashboard/      # Admin charts and totals
│   │   ├── ManageDoctors/       # Doctor list + add/edit form
│   │   ├── CallLogs/            # Telentir call history + transcripts
│   │   ├── VideoConsultation/   # Simulated video call UI
│   │   └── …                    # Doctors, DoctorDetail, Appointments, MedicalHistory, Prescriptions, Notifications, Profile
│   ├── routes/                  # Route table + RequireAuth / RequireRole guards
│   ├── components/              # Reusable UI (cards, chips, dialogs, …)
│   ├── layouts/                 # Sidebar, top bar, page shell; nav items per role
│   ├── store/                   # Zustand: signed-in user, theme, UI state
│   ├── types/                   # Shared TypeScript types (also used by the backend)
│   ├── data/mock.ts             # Sample data: mock mode and development seed data
│   ├── theme/                   # Material UI theme
│   └── constants/, lib/, utils/, config/
│
└── server/                      # Backend (Express + SQLite)
    ├── src/
    │   ├── index.ts             # Starts the server
    │   ├── config.ts            # Reads server/.env; refuses unsafe production settings
    │   ├── routes/              # Every REST endpoint and who may call it
    │   ├── auth/                # Login, sign-up, passwords, tokens, rate limiting, role checks
    │   ├── db/                  # SQLite connection, migrations, seed data
    │   ├── repos/               # All database queries, one file per area
    │   ├── booking.ts           # The single booking path (used by every booking)
    │   ├── doctorInput.ts       # Validation for the doctor form
    │   └── telentir/            # Call sync, reminder calls, knowledge base
    ├── scripts/                 # telentir-sync-knowledge.ts
    └── data/                    # SQLite database (created on first start, not in git)
```

Frontend conventions: imports use the `@/` alias for `src/`; every folder exports through an `index.ts`; route paths come from `ROUTES` in [src/constants/routes.ts](src/constants/routes.ts); pages compose components and hooks, and only services talk to the backend.

## Pages

| Path | Page | Who |
| --- | --- | --- |
| `/login` | Sign in / create account | Everyone |
| `/` | Patient dashboard | Patient |
| `/doctors`, `/doctors/:id` | Find doctors, doctor profile | Patient, admin |
| `/book`, `/book/:doctorId` | Book an appointment | Patient, admin |
| `/appointments` | My appointments (admins see all) | Patient, admin |
| `/history` | Medical history | Patient |
| `/prescriptions` | Prescriptions | Patient |
| `/video`, `/video/:appointmentId` | Video consultation (simulated) | Patient |
| `/notifications` | Notifications | Patient |
| `/profile` | Profile | Patient |
| `/admin` | Admin dashboard | Admin |
| `/manage-doctors` | Manage doctors | Admin |
| `/calls` | Call logs | Admin |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Login page says "Network Error" | The backend isn't running — start it with `npm run server` |
| Signed out right after signing in, or "Your session has expired" | The database was reset or `JWT_SECRET` changed — sign in again |
| "Too many failed attempts" | Wait 15 minutes, or restart the backend (the lock is kept in memory) |
| Changes disappear after reloading the page | You're in mock mode — set `VITE_USE_MOCK=false` in `.env.local` and restart `npm run dev` |
| Changes to `.env.local` have no effect | Restart `npm run dev`; Vite reads env files only at start |
| Backend fails with `JWT_SECRET must be set in production` | Set `JWT_SECRET` and `ADMIN_PASSWORD` in `server/.env` |
| Port 5173 or 4000 already in use | Stop the other process, or use `npm run dev -- --port 3000` / `PORT=4001` |
| Old data after testing | Stop the backend and delete `server/data/` to start fresh |
