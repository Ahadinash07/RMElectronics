# RM Electronics website

Website for **RM Electronics**, a **doorstep** LCD / LED / Smart TV repair service across Hyderabad (shop and workshop in Nagole).
Built with Next.js (App Router), TypeScript (strict) and Tailwind CSS v4. Mobile-first. Colours come from the logo (black-to-navy gradient, lavender, white).

> **Status:** code complete. Dependencies have not yet been installed and `npm run build` has not yet been run
> on this exact code (the environment it was written in had no internet). See [Verification status](#verification-status)
> and run `npm run check` once after installing.

## Prerequisites

- Node.js **20.9 or newer** (Node 22 LTS recommended) and npm
- Internet access on first install and build (npm packages, and Inter from Google Fonts via `next/font`)

## Install and run

```bash
npm install
cp .env.example .env.local     # then fill in values (see below)
npm run dev                    # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally (`npm run build` first) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (validation, lead delivery, enquiry API logic, analytics privacy, content) |
| `npm run check` | lint + typecheck + test + build |


## Doorstep service, logo palette and booking form

- **Doorstep positioning:** the top bar, header, hero, a dedicated "Doorstep TV repair in Hyderabad" section (home, about, services, contact, brand pages, ad pages), process steps, FAQs, footer, titles and meta descriptions all state the doorstep service. Facts live in `DOORSTEP` and `SPARE_PARTS_PHONE` in `src/content/site.ts`.
- **Facts used from the owner's message** (confirm before launch): doorstep service, visiting charges from \u20b9199, technicians with 20+ years of experience, the areas Saidabad, Boduppal, Tarnaka, Badangpet, Kukatpally, Vanasthalipuram (plus Nagole), the second number 90598 88821 for spare-parts/PCB enquiries.
- **Deliberately NOT published** because they came only from an unsourced AI summary: opening hours 9 am to 9 pm, 30 to 90 day part warranty, "10,000+ TVs repaired", workshop pick-and-drop as a promise, and customer quotes. Add each in `site.ts` only after the owner confirms it. The site says only that "if a TV needs workshop work, the team explains the options".
- **Logo palette** (sampled from the logo): navy gradient `#010101` to `#1B1A46`, lavender `#A088E8`, white. Tokens are in `src/app/globals.css`. Add `data-dark` to any element to make it a dark navy band (text, links and secondary buttons adapt automatically). Primary buttons are lavender with navy text (5.6:1 contrast).
- **Logo and favicon:** `public/images/rm-electronics-logo.webp` (full logo, transparent), `rm-electronics-icon.webp` (monitor mark used in the header next to live text), `src/app/icon.png`, `apple-icon.png`, `favicon.ico` and the social image `rm-electronics-og.png` were all generated from the supplied logo.
- **Booking form:** a 3-step wizard (1 brand, 2 problem, 3 details with two fields per row). Same real server delivery and honest error states as before. It appears in a dialog everywhere and inline in the desktop hero and on the contact page.
- **Spacing:** section padding was reduced (`.section` in `globals.css`), plus tighter hero, header and grid gaps.

## Routes

| Route | Purpose |
| --- | --- |
| `/` `/about` `/services` `/gallery` `/contact` `/privacy-policy` | Main pages |
| `/tv-repair/lg-oled` `/samsung` `/sony` `/oneplus` `/vu` | Brand enquiry pages (the URL structure the specification asks for) |
| `/services/<brand>` | 308 redirect to `/tv-repair/<brand>` (so the shorter URLs also work) |
| `/lp/[campaign]` | Ad landing pages, **noindex**. Campaigns: `tv-repair-nagole`, `lg-oled`, `samsung`, `sony`, `oneplus`, `vu` |
| `/thank-you` | Only renders after the server accepted an enquiry, otherwise redirects to `/contact`. **noindex** |
| `/api/repair-enquiry` | POST endpoint that validates and delivers enquiries |
| `/api/review-submission` | POST endpoint that delivers a customer-written review to the owner for approval (never auto-published) |
| `/sitemap.xml` `/robots.txt` | Generated |

To add an ad campaign, add an entry in `src/content/campaigns.ts`. To take a brand page offline until the
owner confirms support for that brand, set `published: false` in `src/content/brands.ts`.

## Lead delivery (required before launch)

There is **no fake mode**. If delivery is not configured, the form shows an honest error ("your enquiry was NOT received,
please call"), the API returns HTTP 503, and `/thank-you` is never reached.

Choose a provider with `LEAD_DELIVERY_PROVIDER` in `.env.local` (and in your hosting dashboard for production).

### Option A: email through Resend (simple)

1. Create a free account at resend.com and an API key.
2. Set:
   ```
   LEAD_DELIVERY_PROVIDER=resend
   RESEND_API_KEY=...
   LEAD_TO_EMAIL=rmelectronics1995@gmail.com
   LEAD_FROM_EMAIL=RM Electronics <leads@your-verified-domain>
   ```
3. Verify a sending domain in Resend. Until then you can test with `LEAD_FROM_EMAIL=onboarding@resend.dev`, but Resend then
   only delivers to **your own Resend account email**, so set `LEAD_TO_EMAIL` to that address for the test.

### Option B: webhook (CRM, Google Sheets via Apps Script, Zapier, Make)

```
LEAD_DELIVERY_PROVIDER=webhook
LEAD_WEBHOOK_URL=https://...        # must be https
LEAD_WEBHOOK_SECRET=...             # optional, sent as "Authorization: Bearer ..."
```
The webhook receives JSON: `reference, receivedAt, name, phone (+91...), brand, model, problem, locality, contactMethod, details, consentVersion, attribution`.

### Testing delivery

1. `npm run dev`, open `/contact` (desktop width) and submit a real test enquiry. You should land on `/thank-you` and receive the email/webhook.
2. Remove the credentials and submit again: you must see the red error and **not** reach `/thank-you`.
3. Or use curl (the `elapsedMs` field must be at least 1500 and `submissionId` a UUID):
   ```bash
   curl -i -X POST http://localhost:3000/api/repair-enquiry -H "Content-Type: application/json" -d '{
     "name":"Test Person","phone":"9876543210","brand":"LG","problem":"TV not turning on","locality":"Nagole",
     "model":"","contactMethod":"Call","details":"","consent":true,"website":"","elapsedMs":5000,
     "submissionId":"3f2b8c1e-5a7d-4e6f-9a1b-2c3d4e5f6a7b"}'
   ```

### Anti-spam and limits

Honeypot field, minimum fill time, input size limit, per-IP rate limit (6 per 10 minutes), duplicate-submission protection
(button lock + idempotency id). The rate limiter and duplicate store live in server memory, so on serverless hosting each instance
has its own counters. This is a speed bump, not a hard guarantee. For strict limits, back `src/lib/rate-limit.ts` with Upstash Redis or Vercel KV.
Add Cloudflare Turnstile if spam appears.

## Analytics and ad conversions

Everything is **off until you add IDs**, and tracking scripts additionally wait for the visitor to accept the cookie banner
(`NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=true`, the default).

| Tool | Variables |
| --- | --- |
| Google Analytics 4 | `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` |
| Google Ads lead conversion | `NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX` and `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=<conversion label>` |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID=...` |

Events: `phone_click`, `whatsapp_click`, `repair_form_open`, `repair_form_start`, `form_error`, `directions_click`, `generate_lead`.

- `generate_lead` (GA4 key event, Google Ads conversion, Meta `Lead`) fires **once, on `/thank-you`**, which the server only renders after it accepted the enquiry. Opening the form, or a failed submission, never counts.
- Only allow-listed labels are sent (placement, page path, form id, error category, utm values). Names, phone numbers, emails, problem text and WhatsApp text are never sent. Values that look like a phone number or email are dropped (`src/lib/analytics.ts`, covered by tests).
- In GA4 mark `generate_lead` as a key event. In Google Ads create a "Submit lead form" conversion and copy its label.
- If you decide consent is not required for your audience, set `NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT=false`. Confirm that is lawful first.


## Reviews and testimonials (real ones only)

The site has a **Customer reviews** section on the home, about, services, gallery, contact and every brand page (and on ad landing pages once reviews exist).
No testimonials or ratings were invented. `src/content/reviews.ts` is empty, so until you add real reviews the section shows an invitation to review, a
"Write a review" button, a link to your Facebook page and (if configured) a "Review us on Google" button.

How reviews get on the site:

1. **From the website:** a visitor presses "Write a review" and submits name, 1 to 5 rating, text and permission. It is emailed/sent to you through the same
   delivery setup as enquiries, with the subject "New review to approve". It is **never published automatically**.
2. **From elsewhere:** a customer reviews you on Google, Facebook or WhatsApp.
3. You confirm they are a real customer who allows publication, then paste their exact words into `src/content/reviews.ts` (template and rules are in that file) and redeploy.
   Reviews show with stars (only if the customer gave a rating), name, area, brand and source. Brand pages show that brand's reviews first.
4. Set `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` to your Google Business Profile review link to show the Google button.

Do not add review or star-rating structured data: Google does not allow self-published reviews of your own business in rich results.
Ask happy customers for a Google review after each repair; that is the strongest, most credible source.

## Gallery, videos and map

- `/gallery`: filterable photo grid (Workshop, Shop and signboard, Display symptom examples) with an accessible lightbox (focus trap, Escape, arrow keys), plus two short **silent** videos that only load when played. A smaller gallery appears on the home, about, services and brand pages.
- 13 photos come from the owner's 6 real photos (detail crops), plus 2 videos (`public/videos/`, audio removed and compressed). Add more by copying files into `public/images/` and adding entries to `src/content/images.ts` (the `GALLERY` array).
- Contact and home pages have a **click-to-load Google Map** built from the written address (no coordinates guessed, no API key, nothing from Google loads until pressed).
- Service and brand cards use workshop photos as decorative images (empty alt) so every card has a visual.

## WhatsApp

Hidden by default. After the owner confirms the number is on WhatsApp, set `NEXT_PUBLIC_WHATSAPP_VERIFIED=true`.
Buttons then appear in the hero, mobile bar, contact page and CTAs, and "WhatsApp" appears as a contact preference.

## Business details and unverified facts

All contact details live in **`src/content/site.ts`**. Opening hours are `null`, so none are shown or published.
Do not add hours, prices, warranty, ratings, "years in business", authorised-service status, home visits or pick-up unless the owner confirms them.
When confirmed, fill `BUSINESS.hours` (with the schema.org string) and the site and structured data update automatically.

## Images

Optimised copies of the owner's real photos are in `public/images/` (WebP, about 55 to 160 KB each, EXIF removed):

| File | Used on |
| --- | --- |
| `rm-electronics-workshop-bench-nagole.webp` | Home hero, LG OLED and Vu pages, structured data (Samsung uses the repair-bench-tv-board photo, OnePlus the sign) |
| `rm-electronics-workshop-floor-tvs.webp` | About hero, Sony page, gallery |
| `rm-electronics-repair-bench-tv-board.webp` | Services hero, gallery |
| `rm-electronics-shop-sign-nagole.webp` | Location and contact sections (cropped to remove a neighbouring shop's ad) |
| `rm-electronics-example-display-vertical-lines.webp`, `...-distorted-picture.webp` | Services page, labelled as symptom examples |
| `rm-electronics-bench-*.webp`, `...-floor-*.webp`, `...-shelf-*.webp` | Detail crops used in the gallery and as service-card images |
| `rm-electronics-og.png` | Social share image |

Alt text and captions are in `src/content/images.ts`. Three photos were deliberately **not** used: one showing a film frame,
one showing sponsor logos, and one showing people. One of the three WhatsApp videos was not used because it shows third-party app content; the other two are in the gallery as silent clips.
To add or swap a photo: put the file in `public/images/`, add an entry to `src/content/images.ts` with real alt text.

## Deployment

Works on any Next.js host (Vercel is the simplest).

1. Push to a Git repository and import it into the host.
2. Add every variable from `.env.example` in the host's settings (set `NEXT_PUBLIC_SITE_URL` to the final `https://...` origin **before** building: it drives canonicals, sitemap and Open Graph).
3. Build command `npm run build`, start command `npm run start` (Vercel detects these).
4. Point the domain, then submit `/sitemap.xml` in Google Search Console and claim/verify the Google Business Profile.

## Manual launch checklist

- [ ] `npm install`, then `npm run check` passes locally
- [ ] Lead delivery configured, a real enquiry reaches the owner, and the failure state was tested
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production domain
- [ ] Owner confirms: phone number is correct and whether it is on WhatsApp; email inbox is monitored
- [ ] Owner confirms each brand page is accurate (LG OLED, Samsung, Sony, OnePlus, Vu). Unpublish any that are not supported
- [ ] Owner confirms the process steps on the home/about pages match how the business really works (estimate before work, etc.)
- [ ] **Address spelling:** the main sign says "Shrungeri Colony" but one banner in the photos says "Srinagar Colony". The site uses "Shrungeri Colony". Confirm
- [ ] Real reviews collected and added to `src/content/reviews.ts`; Google review link set
- [ ] Optional claims added only if verified (hours, warranty, home service, years in business)
- [ ] Privacy policy reviewed by the owner (and a lawyer if desired) against the provider actually chosen
- [ ] Analytics IDs added and `generate_lead` verified in GA4 DebugView / Google Tag Assistant / Meta Pixel Helper
- [ ] Tested on a real phone (320px to 430px) and a tablet: menu, sticky bar, enquiry sheet, keyboard, form errors
- [ ] Lighthouse / PageSpeed run on production for LCP, INP, CLS (targets: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less; not yet measured)
- [ ] Screen reader pass (VoiceOver/TalkBack) of the enquiry dialog
- [ ] Google Business Profile matches name, address and phone exactly

## Verification status

Honest record of what was and was not run while writing this code in an offline environment:

| Check | Result |
| --- | --- |
| `npm install` | **Not run** (no network) |
| `npm run build` | **Not run** |
| `npm run lint` (ESLint) | **Not run** |
| Unit tests (`tsx --test`, 85 tests) | **Passed** |
| Strict TypeScript on the logic layer (`src/lib`, `src/content`) and tests, real types | **Passed** |
| Strict TypeScript on all of `src/` with react/next type *stubs* | **Passed** (checks this project's own imports, props and types; framework types were stubbed) |
| Server-rendering every page with mocked `next/*` modules, then auditing the HTML | **Passed**: one `h1` per page, no heading jumps, no duplicate IDs, all internal links and images resolve, correct tel/mailto/social links, noindex on `/thank-you` and `/lp/*`, thank-you gate redirects without the cookie |
| Visual/responsive/browser testing, Lighthouse, screen readers | **Not run** |

Package versions in `package.json` are caret ranges chosen without registry access (Next 16, React 19.2, Tailwind 4.1, TypeScript 5.9, ESLint 9).
If `npm install` reports a peer-dependency mismatch, adjust the version and re-run. Commit the generated `package-lock.json`.

## Project structure

```
src/
  app/            routes, layouts, sitemap, robots, API route
    (site)/       pages with header + footer
    (landing)/    minimal ad landing layout
  components/     layout, sections, forms (modal + form), analytics, ui
  content/        site (contact details), brands, services, faqs, campaigns, images
  lib/            validation, lead-delivery, enquiry-handler, rate-limit, analytics, consent, seo
tests/            node:test unit tests
public/images/    optimised photos
```
