# CarePoint

Web app for CarePoint, a doctor appointment platform. Patients see which times are really open, book one and pay in a single step. Doctors, clinics and admins get tools to run the other side.

- **Live demo:** <https://carepoint-client.vercel.app> (the API runs on a free host, so the first load after idle can take up to a minute)
- **Server repository:** <https://github.com/tawchifulislam/carepoint-server>

## Try it

Sign up as a patient with any email and book a doctor with the Stripe test card `4242 4242 4242 4242`, any future expiry and any CVC. Payments run in Stripe's test mode, so no money moves.

## What each role can do

- **Patient:** search doctors by name, specialty or clinic and see each doctor's next open time. Pick a slot, pay, then manage appointments from a dashboard, including rescheduling and cancelling with an automatic refund up to two hours before.
- **Doctor:** set weekly availability for several days at once, block days off, see today's schedule, mark visits completed or no-show, and cancel an appointment with a full refund.
- **Clinic admin:** register a clinic, approve the doctors who join, and follow bookings and revenue by day and by doctor.
- **Super admin:** review clinic and doctor applications, reverse decisions, and watch platform totals.

## UI decisions

- **Next.js App Router.** Doctor search and profile pages render on the server, with per-page metadata, so they are crawlable and fast on first load. Only the interactive parts, such as the slot picker and dashboards, are client components.
- **Select first, then confirm.** Tapping a time only highlights it. A summary panel (a side card on desktop, a bottom sheet on mobile) holds the single "Confirm and pay" action, so an accidental tap never books anything.
- **Taken slots are handled.** If someone else books the slot first, the API answers `409`. The app clears the selection, reloads availability and explains what happened.
- **Every screen has its states.** Skeletons while loading, dashed empty states with a next action, and error cards with a retry button.
- **Dates are shown in the clinic's time zone,** formatted with `Intl.DateTimeFormat` and a fixed zone, so a late-night slot never lands on the wrong day.
- **Accessibility basics.** Labelled fields with described errors, keyboard-closable dialogs, focus states, and reduced-motion support.

## Tech stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Geist, lucide-react, react-hook-form with Zod, Recharts, and the Better Auth client.

## Setup

```bash
git clone https://github.com/tawchifulislam/carepoint-client.git
cd carepoint-client
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL of the CarePoint server, for example `http://localhost:4000` |
| `NEXT_PUBLIC_GOOGLE_AUTH` | `true` shows the Google sign-in button (requires the server to be configured for it) |

Both are compiled in at build time, so changing them on a host needs a redeploy. Build with `npm run build`.

## How it talks to the server

- Signing in stores a session token in the browser. For each API call the client exchanges it for a short-lived JWT and sends it as a `Bearer` header. All of this lives in `src/lib/api.ts` and `src/lib/auth-client.ts`.
- An `AuthProvider` holds the signed-in user and role for the whole app, so the header and route guards always agree.
- Route guards only improve the experience. The API checks permissions on every request, so bypassing the guards in the browser exposes nothing.
- Redirecting to sign-in remembers where you were going (`?next=`), accepts only paths inside the app, and returns you to the same page afterwards.
- Google sign-in redirects through the API, which hands the app a one-time token to exchange for a session. This is needed because the app and API are on different domains, where cookies do not travel.

## Project structure

```text
src/
  app/                  routes
    (auth)/             sign in, sign up, password reset, Google callback
    doctors/            search and profile with slot picker
    appointments/       status after payment, reschedule
    dashboard/          patient appointments
    doctor-portal/      appointments, availability, leave days
    clinic-admin/       overview and doctor approvals
    super-admin/        platform overview and review queues
    onboarding/         clinic registration and doctor application
  components/           shared UI (dialogs, form fields, slot selector)
  lib/                  API clients, formatting, validators, hooks
  types/                response shapes
```

## Limitations and next steps

- **The session token lives in local storage,** so a cross-site scripting bug could expose it. The app renders no raw HTML, which keeps that risk low today. Next step: cookie-based sessions once the app and API share a parent domain.
- **Cold starts.** The API sleeps on the free host, so the first request can wait up to a minute. Next step: a warm-up request on page load and a clear waiting message.
- **No automated front-end tests yet.** Next step: end-to-end tests of the booking flow.
- **No performance score is listed here** because I have not measured one yet.
- **The logo is still a text wordmark.**

## Deployment

Deployed on Vercel with the two environment variables above. CI (`.github/workflows/ci.yml`) runs lint, type-check and a production build on every push.
