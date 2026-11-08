Build a complete Russian mobile-first WAKE booking prototype in the existing repository. Customers can search exact date/time/duration availability, compare listings on a list/map, book without reselecting time, cancel reservations and persist favorites. Owners can publish boats with uploaded photos and multiple tariffs, set working hours and calendar blocks, and see customer reservations immediately in the same browser.

- Next.js App Router, React, TypeScript, Tailwind, Radix/shadcn-style UI, Lucide and Leaflet; no backend, paid API, authentication, payment flow or required environment variables.
- Shared localStorage state and tested half-open interval overlap rules across every sport/service for a boat; exact tariff pricing and Moscow-time schedules.
- Browser speech recognition with editable Russian text interpretation and honest fallback; PWA manifest, icons and verified offline shell.
- Ten clearly fictional demo schools, including two unconnected operator examples with standalone demo pages. Original AI-generated illustrative sports/boat imagery. No fabricated real operator connection, rating or live availability claims.
- Responsive iPhone/desktop layouts, accessible dialogs, full reset, useful empty states and local-storage error handling.
- README includes running, Vercel deployment, data limitations and test instructions; CI runs the domain suite, production build and browser journeys.

Validation: `npm install`, `npm test` (11 passed), `npm run build`, `npm run test:e2e` (8 passed), and `npm run format:check`. Browser journeys cover direct booking/cancellation, overlap across sports, owner/customer integration, calendars, favorites persistence, editable text commands, external demo pages, offline reload and reset; mobile viewport is 390px, with desktop overflow/image checks.

Limitations: physical iPhone Safari microphone recognition has not been verified. Online map tiles need Internet; a clearly labeled approximate local schematic is available on failure. School details/rates are simulated because real Moscow sources could not be verified under this environment's network policy. This PR does not merge or deploy the application; a connected Vercel project can deploy after merge to main.
