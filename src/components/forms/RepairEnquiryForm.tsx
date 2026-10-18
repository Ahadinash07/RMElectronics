"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { buttonClasses } from "@/components/ui/button-styles";
import { TextField } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BUSINESS, buildWhatsAppUrl, DOORSTEP } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { uuid } from "@/lib/uuid";
import { formatEnquiryWhatsAppMessage } from "@/lib/whatsapp";
import {
  BRAND_OPTIONS,
  EMPTY_VALUES,
  PROBLEM_OPTIONS,
  firstInvalidField,
  validateFormValues,
  type EnquiryFormValues,
  type FieldErrors,
  type FieldName,
} from "@/lib/validation";

type Step = 1 | 2 | 3;
type ApiResponse = { ok?: boolean; code?: string; errors?: FieldErrors };
type Banner = { message: string; showCall: boolean } | null;

type Props = {
  /** True while the form is visible to the user (dialog open, or inline form mounted). */
  active: boolean;
  /** Where the form was opened from; sent to analytics as a label only. */
  placement: string;
  defaultBrand?: string | undefined;
  onSuccess?: () => void;
};

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Brand" },
  { n: 2, label: "Problem" },
  { n: 3, label: "Contact" },
];

const PROBLEM_ICONS: Record<string, IconName> = {
  "TV not turning on": "power",
  "Sound but no picture": "screenOff",
  "Lines or colour distortion on screen": "lines",
  "Backlight or brightness issue": "sun",
  "No sound or distorted sound": "volume",
  "Smart TV, Wi-Fi or app issue": "wifi",
  Other: "info",
};

const STEP_OF_FIELD: Record<FieldName, Step> = {
  brand: 1,
  problem: 2,
  name: 3,
  phone: 3,
  locality: 3,
  model: 3,
  contactMethod: 3,
  details: 3,
  consent: 3,
};

function failureMessage(status: number, code: string | undefined): { message: string; category: string } {
  if (status === 429) return { message: "Too many attempts in a short time. Please wait a few minutes and try again, or call us.", category: "rate_limited" };
  if (status === 503)
    return { message: "Your enquiry could not be sent because online booking is not available right now. It has NOT been received. Please call us instead.", category: "not_configured" };
  if (status === 502) return { message: "We could not deliver your enquiry right now. It has NOT been received. Please try again in a moment, or call us.", category: "delivery_failed" };
  if (code === "rejected") return { message: "We could not accept this submission. Please check your details and try again, or call us.", category: "rejected" };
  return { message: "Something went wrong and your enquiry was NOT sent. Please try again, or call us.", category: "unknown" };
}

/**
 * Three-step enquiry wizard: 1) TV brand  2) problem  3) your name and mobile number.
 * Short steps mean the form never needs a long scroll. Validation runs on the client for
 * instant feedback AND again on the server; success is shown only after the server accepts the lead.
 */
export function RepairEnquiryForm({ active, placement, defaultBrand, onSuccess }: Props) {
  const router = useRouter();
  const uid = useId();
  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<EnquiryFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const [honeypot, setHoneypot] = useState("");

  const openedAt = useRef(0);
  const started = useRef(false);
  const submissionId = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const effective: EnquiryFormValues = { ...values, brand: values.brand || defaultBrand || "" };
  const idFor = (field: FieldName) => `${uid}-${field}`;

  useEffect(() => {
    if (!active) return;
    openedAt.current = performance.now();
    started.current = false;
  }, [active]);

  // Move focus to the step heading when the step changes (not on first render).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackEvent("repair_form_start", { placement });
  }

  function update(field: FieldName, value: string | boolean) {
    markStarted();
    const next = { ...effective, [field]: value } as EnquiryFormValues;
    setValues(next);
    setBanner(null);
    if (errors[field]) {
      const fresh = validateFormValues(next)[field];
      setErrors((prev) => {
        const copy = { ...prev };
        if (fresh) copy[field] = fresh;
        else delete copy[field];
        return copy;
      });
    }
  }

  function validateOne(field: FieldName) {
    const fresh = validateFormValues(effective)[field];
    setErrors((prev) => {
      const copy = { ...prev };
      if (fresh) copy[field] = fresh;
      else delete copy[field];
      return copy;
    });
  }

  function goTo(next: Step) {
    setBanner(null);
    // Errors belong to the step that was validated. Do not carry contact
    // errors into the contact step when the visitor advances from step 2.
    setErrors({});
    setStep(next);
  }

  function next() {
    const all = validateFormValues(effective);
    const field: FieldName = step === 1 ? "brand" : "problem";
    if (all[field]) {
      setErrors((prev) => ({ ...prev, [field]: all[field] }));
      trackEvent("form_error", { error_category: `validation_step_${step}` });
      return;
    }
    goTo((step + 1) as Step);
  }

  function showFieldErrors(fieldErrors: FieldErrors, category: string) {
    setErrors(fieldErrors);
    const first = firstInvalidField(fieldErrors);
    trackEvent("form_error", { error_category: category });
    if (!first) return;
    const target = STEP_OF_FIELD[first];
    if (target !== step) setStep(target);
    const count = Object.keys(fieldErrors).length;
    setBanner({ message: `Please check ${count === 1 ? "the highlighted field" : `the ${count} highlighted fields`} and try again.`, showCall: false });
    requestAnimationFrame(() => document.getElementById(first === "brand" || first === "problem" ? `${idFor(first)}-0` : idFor(first))?.focus());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step !== 3) return next();
    if (submittingRef.current) return; // duplicate-submission guard

    const clientErrors = validateFormValues(effective);
    if (Object.keys(clientErrors).length > 0) return showFieldErrors(clientErrors, "validation_client");

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setBanner({ message: "You appear to be offline, so your enquiry was NOT sent. Reconnect and try again, or call us.", showCall: true });
      trackEvent("form_error", { error_category: "offline" });
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setBanner(null);
    submissionId.current ??= uuid();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch("/api/repair-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...effective,
          website: honeypot,
          // This runs inside the submit event handler, not during render.
          // eslint-disable-next-line react-hooks/purity
          elapsedMs: Math.round(performance.now() - openedAt.current),
          submissionId: submissionId.current,
          attribution: readAttribution(),
        }),
        signal: controller.signal,
      });

      let data: ApiResponse | null = null;
      try {
        data = (await response.json()) as ApiResponse;
      } catch {
        data = null;
      }

      if (response.ok && data?.ok === true) {
        // The form submission has already been accepted by the configured
        // server provider. WhatsApp is a customer-controlled follow-up draft:
        // the visitor still presses Send in WhatsApp.
        if (BUSINESS.whatsappVerified) {
          window.open(buildWhatsAppUrl(formatEnquiryWhatsAppMessage(effective)), "_blank", "noopener,noreferrer");
        }
        // Server accepted the lead: only now reset and move to the thank-you page.
        submissionId.current = null;
        setValues(EMPTY_VALUES);
        setErrors({});
        setStep(1);
        onSuccess?.();
        router.push("/thank-you");
        return;
      }
      if (response.status === 400 && data?.code === "invalid" && data.errors) return showFieldErrors(data.errors, "validation_server");

      const failure = failureMessage(response.status, data?.code);
      setBanner({ message: failure.message, showCall: true });
      trackEvent("form_error", { error_category: failure.category });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "AbortError";
      setBanner({
        message: timedOut
          ? "The request took too long, so your enquiry was NOT confirmed as sent. Please try again, or call us."
          : "We could not reach the server, so your enquiry was NOT sent. Check your connection and try again, or call us.",
        showCall: true,
      });
      trackEvent("form_error", { error_category: timedOut ? "timeout" : "network" });
    } finally {
      window.clearTimeout(timer);
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const onText =
    (field: FieldName) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      // The callback runs from an input event; update also marks analytics state in refs.
      // eslint-disable-next-line react-hooks/refs
      update(field, e.target.value);

  const cardBase =
    "flex min-h-14 w-full cursor-pointer items-center justify-center rounded-control border-2 border-line bg-surface px-3 py-3 text-center text-base font-semibold text-ink-2 transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-lavender-100 peer-checked:text-brand peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-info";

  const headingClass = "heading-3 outline-none";
  const hasEnquiryDetails = Boolean(effective.name || effective.phone || effective.brand || effective.problem);
  const whatsappMessage = hasEnquiryDetails ? formatEnquiryWhatsAppMessage(effective) : undefined;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="w-full">
      {/* Progress */}
      <ol className="mb-4 flex items-center" aria-label="Progress">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const current = step === s.n;
          return (
            <li key={s.n} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`} aria-current={current ? "step" : undefined}>
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  done || current ? "border-accent bg-accent text-brand" : "border-line bg-white text-muted"
                }`}
              >
                {done ? <Icon name="check" className="h-5 w-5" /> : s.n}
              </span>
              <span className={`ml-2 text-sm font-semibold ${done || current ? "text-brand" : "text-muted"}`}>
                {s.label}
                <span className="sr-only">{done ? " (completed)" : current ? " (current step)" : ""}</span>
              </span>
              {i < STEPS.length - 1 ? <span aria-hidden="true" className="mx-3 h-px flex-1 bg-line" /> : null}
            </li>
          );
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        Step {step} of 3: {STEPS[step - 1]?.label}
      </p>

      {banner ? (
        <div role="alert" className="mb-4 rounded-control border border-danger bg-[#fef2f2] p-3 text-sm font-medium text-[#14122e]">
          <p className="flex items-start gap-2">
            <Icon name="alert" className="mt-0.5 h-5 w-5 text-danger" />
            <span>{banner.message}</span>
          </p>
          {banner.showCall ? (
            <p className="mt-2 pl-7">
              <CallLink placement="form_error" className="font-semibold text-link underline underline-offset-4">
                Call {BUSINESS.phone.display}
              </CallLink>
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Step 1: brand */}
      {step === 1 ? (
        <fieldset className="min-w-0">
          <legend className="sr-only">TV brand</legend>
          <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
            Which TV do you have?
          </h3>
          <p className="mt-1 text-sm text-ink-2">Choose the brand. A doorstep technician visit can be booked for any of these.</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-describedby={errors.brand ? `${idFor("brand")}-error` : undefined}>
            {BRAND_OPTIONS.map((b, i) => (
              <label key={b} className="relative">
                <input
                  id={`${idFor("brand")}-${i}`}
                  type="radio"
                  name={`${uid}-brand`}
                  value={b}
                  checked={effective.brand === b}
                  onChange={() => update("brand", b)}
                  className="peer sr-only"
                  data-autofocus={i === 0 ? "" : undefined}
                />
                <span className={cardBase}>{b === "Other" ? "Other brand" : b}</span>
              </label>
            ))}
          </div>
          {errors.brand ? (
            <p id={`${idFor("brand")}-error`} className="mt-2 text-sm font-medium text-danger">
              <span className="font-semibold">Error: </span>
              {errors.brand}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* Step 2: problem */}
      {step === 2 ? (
        <fieldset className="min-w-0">
          <legend className="sr-only">Problem</legend>
          <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
            What is the problem?
          </h3>
          <p className="mt-1 text-sm text-ink-2">Pick the closest match. The technician confirms the real cause at your home.</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-describedby={errors.problem ? `${idFor("problem")}-error` : undefined}>
            {PROBLEM_OPTIONS.map((p, i) => (
              <label key={p} className="relative">
                <input
                  id={`${idFor("problem")}-${i}`}
                  type="radio"
                  name={`${uid}-problem`}
                  value={p}
                  checked={effective.problem === p}
                  onChange={() => update("problem", p)}
                  className="peer sr-only"
                />
                <span className={`${cardBase} justify-start gap-3 text-left`}>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand">
                    <Icon name={PROBLEM_ICONS[p] ?? "info"} className="h-5 w-5" />
                  </span>
                  <span>{p}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.problem ? (
            <p id={`${idFor("problem")}-error`} className="mt-2 text-sm font-medium text-danger">
              <span className="font-semibold">Error: </span>
              {errors.problem}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {/* Step 3: contact details */}
      {step === 3 ? (
        <div>
          <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
            How can we reach you?
          </h3>
          <p className="mt-1 text-sm text-ink-2">
            {effective.brand} &middot; {effective.problem}.{" "}
            <button type="button" onClick={() => goTo(1)} className="font-semibold text-link underline underline-offset-4">
              Change
            </button>
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <TextField
              id={idFor("name")}
              label="Your name"
              required
              autoComplete="name"
              value={effective.name}
              onChange={onText("name")}
              onBlur={() => validateOne("name")}
              error={errors.name}
              data-autofocus
            />
            <TextField
              id={idFor("phone")}
              label="Mobile number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="98765 43210"
              value={effective.phone}
              onChange={onText("phone")}
              onBlur={() => validateOne("phone")}
              error={errors.phone}
            />
          </div>

          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Leave this field empty
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </label>
          </div>

          <div className="mt-3">
            <div className="flex items-start gap-3">
              <input
                id={idFor("consent")}
                type="checkbox"
                checked={effective.consent}
                onChange={(e) => update("consent", e.target.checked)}
                aria-required="true"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? `${idFor("consent")}-error` : undefined}
                className="mt-0.5 h-6 w-6 shrink-0 rounded border-[#9ca3af] accent-brand"
              />
              <label htmlFor={idFor("consent")} className="text-sm leading-snug text-ink-2">
                I agree that RM Electronics may use these details to contact me about this enquiry. See the{" "}
                <Link href="/privacy-policy" target="_blank" rel="noopener" className="text-link">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.consent ? (
              <p id={`${idFor("consent")}-error`} className="mt-1.5 text-sm font-medium text-danger">
                <span className="font-semibold">Error: </span>
                {errors.consent}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => goTo((step - 1) as Step)}
            className="inline-flex min-h-12 items-center gap-2 rounded-control bg-surface px-5 font-semibold text-ink-2 hover:bg-lavender-100"
          >
            <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
            Back
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button type="button" onClick={next} className={buttonClasses("primary", "md", "ml-auto")}>
            Continue
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        ) : (
          <button type="submit" disabled={submitting} className={buttonClasses("primary", "md", "ml-auto")}>
            {submitting ? "Sending..." : "Book doorstep visit"}
            {submitting ? null : <Icon name="arrowRight" className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* <p className="mt-3 text-center text-xs text-muted">
        {DOORSTEP.visitingChargeText} Prefer to talk?{" "}
        <CallLink placement="form" className="font-semibold text-link underline underline-offset-4">
          Call {BUSINESS.phone.display}
        </CallLink>
        <WhatsAppLink
          placement="form"
          message={whatsappMessage}
          className="ml-2 inline-flex items-center gap-1 font-semibold text-link underline underline-offset-4"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          <span>WhatsApp</span>
        </WhatsAppLink>
      </p> */}
    </form>
  );
}
