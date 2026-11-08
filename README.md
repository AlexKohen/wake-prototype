# WAKE

Russian, mobile-first wakesurfing and wakeboarding booking prototype for Moscow. Built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style Radix UI components, Lucide and Leaflet. No backend, authentication, payment integration, database or required environment variables.

## Run locally

Use Node.js 22 or newer (validated with Node.js 24).

```sh
npm install
npm run dev
```

For a production build:

```sh
npm run build
npm start
```

The app runs on port 3000. For a physical phone, deploy over HTTPS or access the development server on your network; microphone and PWA features require a secure context (HTTPS, or localhost for local development).

In a restricted cloud sandbox where the default npm cache is read-only, use `npm install --cache /tmp/wake-npm-cache`. No environment configuration changes are required by the app.

## Try the prototype

- Choose **Хочу покататься**, search without dates to browse, or set date, time, sport and duration to see only available boats. Exact-time results open confirmation directly without asking for the time again.
- Confirm a demo reservation, find it in **Брони**, or cancel it to release the interval.
- Use **Карта** for price markers and direct booking, or save a listing in **Избранное**.
- Open the top-right menu to switch to **Я владелец катера / школы**. Add a boat, upload a photo, add multiple sport/service/duration/price tariffs and publish it. It immediately appears in customer search in this browser.
- In **Расписание**, select a boat and date; switch between day and week, edit daily hours, block a whole day or an interval, and remove blocks. Customer reservations appear here and in owner bookings. Blocks cannot silently overwrite existing reservations.
- Both roles have voice input and a text fallback. For example: `Хочу вейксерф в Строгино завтра в 15:00 на полчаса` or `Добавь катер Malibu 23 LSV 2020 года. Вейксерф и вейкборд. Сет 25 минут стоит 7000 рублей. Работаем с 9 утра до 9 вечера`. Interpretation is editable and requires confirmation. Unsupported or unrecognized input is reported honestly.
- **Сбросить демо** in the role menu restores the original catalog after confirmation.

## Data and booking rules

The versioned `wake-demo-v1` localStorage record contains boats, school information, tariffs, bookings, calendar blocks and favorites. The original catalog has 10 explicitly fictional operators: eight simulate connected schools and two simulate external, unconnected schools. Two initial boats belong to the demo owner, along with every new boat created in owner mode.

The two unconnected schools link to clearly labeled standalone demo pages, not invented real-world operator websites. Their live availability is never claimed, and they cannot be booked inside WAKE. They are omitted from exact-time availability results.

All schools, rates and availability are simulated. Boat model names are real model names; images are original AI-generated illustrative imagery and do not depict or identify a listed operator or exact boat model. District coordinates represent approximate water areas, not verified piers. Real Moscow operator websites could not be verified with the cloud environment's outbound policy, so none are falsely presented as connected or verified. No fabricated ratings or reviews are shown.

All school schedules and booking times are interpreted as Moscow time (UTC+3), including the past-slot guard, regardless of device timezone. Bookings use half-open intervals: 15:00–15:30 conflicts with 15:15–15:45, but permits a new booking starting at 15:30. Availability is checked across all sports and services for a boat, including working hours, past times, reservations and manual blocks. Prices use an exact configured tariff, never an invented proportional price. Cancellation preserves history and immediately releases availability. Confirmation rereads localStorage to catch already-saved changes from another tab; other tabs receive storage events.

This is a single-browser prototype, not a concurrent reservation server. Data does not synchronize between devices or people. Clearing site data removes saved demo records. Uploaded photos are compressed locally to reduce storage usage; a full storage error is shown rather than claiming a reservation was saved.

## Map, voice and PWA

Leaflet displays OpenStreetMap/CARTO raster tiles without an API key. When tiles cannot load, a bundled, clearly labeled schematic water-area overview keeps markers and the school list usable. The fallback is intentionally approximate and must not be used for navigation. Online tiles require Internet access to `*.basemaps.cartocdn.com`.

Speech recognition uses `SpeechRecognition`/`webkitSpeechRecognition` with Russian recognition when available. Browser support, HTTPS, permission and recognition-service connectivity vary, especially on iOS. Recognition may use the browser vendor's speech service. Text parsing is entirely local; no paid AI service is used. Actual microphone recognition on a physical iPhone was not tested in this environment.

The PWA manifest, icons and production service worker support home-screen installation and a cached offline shell after first successful loading. Same-origin assets are cached; external map tiles and voice recognition are not guaranteed offline. The worker is registered only in production. Browser installation prompts vary; on iPhone use Safari's Share → Add to Home Screen.

## Validation

```sh
npm test              # booking, overlap, pricing, availability and Russian parsers
npm run typecheck
npm run build
npm run test:e2e      # production browser journeys at iPhone viewport and desktop
npm run format:check
```

Playwright uses system Chromium at `/usr/bin/chromium` when available, or its installed Chromium otherwise. Override with `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if needed. On a new machine without system Chromium, run `npx playwright install --with-deps chromium` first. The E2E runner starts a production server if one is not running, so build first. Screenshots and failure traces are written to ignored `test-results/`.

Tests cover customer booking and cancellation, cross-sport exclusion, owner calendar updates, creation and publication into customer search, multi-sport tariffs, blocks, favorites persistence, editable text interpretation, external demo pages, unsupported speech fallback, reset, offline shell, local image loading and horizontal overflow. Mobile checks emulate a 390px iPhone in Chromium; they are not a substitute for physical Safari testing.

## Vercel deployment

Import **AlexKohen/wake-prototype**, select the Next.js framework preset, keep the repository root as root directory, use Node.js 22 or newer, and set the production branch to `main`. Default install/build commands work; no secrets or environment variables are needed. If the repository is already connected to Vercel with automatic deployments, merging the PR into `main` triggers deployment. Preview deployments depend on the existing Vercel project settings and GitHub integration.

No deployment, repository merge or real-world reservation is performed by the app. The shared public URL must come from the connected Vercel project's successful deployment.
