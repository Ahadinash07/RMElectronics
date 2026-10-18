# AGENTS.md

Guidance for AI coding agents and developers working on this repository.

## Project
Marketing + lead-capture site for RM Electronics (TV repair, Nagole, Hyderabad). Next.js App Router, strict TypeScript, Tailwind v4, no database.

## Commands
`npm run dev` | `npm run lint` | `npm run typecheck` | `npm test` | `npm run build` | `npm run check` (all of them).
Run lint, typecheck and tests before finishing any change. Never report a command as passing unless you ran it.

## Hard rules (business and trust)
- Contact details come ONLY from `src/content/site.ts`. Never hard-code phone, email, address or social URLs elsewhere.
- Facts supplied by the owner live in `DOORSTEP` (src/content/site.ts). Do not invent or add: opening hours, other prices, warranties, ratings or reviews, testimonials, years in business, authorised-service status, same-day promises, pick-up/drop-off promises, other service-area claims, coordinates. If the owner confirms one, add it in `site.ts` and update copy and tests.
- Symptoms are "possible issues", never diagnoses. Never promise a repair outcome, price or turnaround.
- WhatsApp UI only renders when `NEXT_PUBLIC_WHATSAPP_VERIFIED=true`.
- Brand pages must stay genuinely different (`tests/content.test.ts` enforces it). Use `published: false` to take one offline.

## Lead delivery and analytics (do not weaken)
- No fake or log-only delivery mode. Success is returned only after the provider accepts the lead (`src/lib/enquiry-handler.ts`). `/thank-you` requires the server-set cookie.
- Secrets are server-only env vars. Only `NEXT_PUBLIC_*` may be read in client code, and via literal `process.env.NEXT_PUBLIC_X` references.
- `generate_lead` fires only from `LeadConversion` on `/thank-you`. Never fire it on form open, submit click or failure.
- Analytics goes through `trackEvent`, which allow-lists parameters. Never pass names, phone numbers, emails, problem text or message text.

## Code conventions
- Server Components by default. Add `"use client"` only for state, effects, browser APIs or event handlers.
- Next 16: `params` and `cookies()` are async. No `middleware.ts` (it is `proxy.ts` now) is needed here.
- Avoid synchronous `setState` inside `useEffect` (React lint rule); prefer derived values or `useSyncExternalStore`.
- Buttons: two styles only (primary orange with deep-purple text, secondary outline). Use `buttonClasses()`. White text on the orange fails contrast.
- Palette comes from the logo (navy gradient, lavender, white): use the tokens in `src/app/globals.css`. Use `data-dark` for navy bands. No orange. Icons come from `src/components/ui/Icon.tsx` (no emoji, no icon fonts).
- Mobile first from 320px. Headings and text come before their image in the DOM. Long forms open in the dialog on phones, never inline.
- Every page sets `buildMetadata()` (unique title and description, canonical). Only add JSON-LD properties that are verified facts.
- Keep `src/lib` free of React/Next imports so it stays unit-testable with `tsx --test`.

## Reviews, gallery and media
- Never invent testimonials, ratings or review counts. `src/content/reviews.ts` holds only real, permissioned reviews. Submitted reviews are never auto-published (`src/lib/review-handler.ts`).
- Do not add review/aggregateRating JSON-LD for the business's own site.
- New photos go in `public/images/` as optimised WebP and need real alt text and a caption in `src/content/images.ts`. Do not use photos that show identifiable people, third-party logos or copyrighted content.
- Videos must be silent or have rights cleared, load on demand (`preload="metadata"`), and be described in `VIDEOS`.
