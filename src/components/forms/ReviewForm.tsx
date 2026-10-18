"use client";

import Link from "next/link";
import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CallLink } from "@/components/analytics/ContactLinks";
import { buttonClasses } from "@/components/ui/button-styles";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { uuid } from "@/lib/uuid";
import { BRAND_OPTIONS } from "@/lib/validation";
import {
  EMPTY_REVIEW,
  REVIEW_FIELD_ORDER,
  REVIEW_LIMITS,
  validateReviewValues,
  type ReviewFieldErrors,
  type ReviewFieldName,
  type ReviewFormValues,
} from "@/lib/review-validation";

type Props = { onDone: () => void };
type ApiResponse = { ok?: boolean; code?: string; errors?: ReviewFieldErrors };

export function ReviewForm({ onDone }: Props) {
  const uid = useId();
  const [values, setValues] = useState<ReviewFormValues>(EMPTY_REVIEW);
  const [errors, setErrors] = useState<ReviewFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const submissionId = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const openedAt = useRef(0);

  // Track time since the form first became visible (basic bot check). Done lazily on first input.
  const touchTimer = () => {
    if (openedAt.current === 0) openedAt.current = performance.now();
  };

  const idFor = (f: ReviewFieldName) => `${uid}-${f}`;

  function update(field: ReviewFieldName, value: string | boolean) {
    touchTimer();
    const next = { ...values, [field]: value } as ReviewFormValues;
    setValues(next);
    if (errors[field]) {
      const fresh = validateReviewValues(next)[field];
      setErrors((prev) => {
        const copy = { ...prev };
        if (fresh) copy[field] = fresh;
        else delete copy[field];
        return copy;
      });
    }
  }

  function validateOne(field: ReviewFieldName) {
    const fresh = validateReviewValues(values)[field];
    setErrors((prev) => {
      const copy = { ...prev };
      if (fresh) copy[field] = fresh;
      else delete copy[field];
      return copy;
    });
  }

  function showErrors(fieldErrors: ReviewFieldErrors) {
    setErrors(fieldErrors);
    const first = REVIEW_FIELD_ORDER.find((f) => fieldErrors[f]);
    setBanner("Please check the highlighted fields and try again.");
    trackEvent("form_error", { form_id: "review", error_category: "validation" });
    if (first) requestAnimationFrame(() => document.getElementById(first === "rating" ? `${idFor("rating")}-1` : idFor(first))?.focus());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    const clientErrors = validateReviewValues(values);
    if (Object.keys(clientErrors).length > 0) return showErrors(clientErrors);

    submittingRef.current = true;
    setSubmitting(true);
    setBanner(null);
    submissionId.current ??= uuid();
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch("/api/review-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          elapsedMs: Math.round(performance.now() - (openedAt.current || performance.now() - 60_000)),
          submissionId: submissionId.current,
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
        submissionId.current = null;
        setValues(EMPTY_REVIEW);
        setErrors({});
        setSent(true);
        trackEvent("review_submit", { form_id: "review" });
        return;
      }
      if (response.status === 400 && data?.code === "invalid" && data.errors) return showErrors(data.errors);
      setBanner(
        response.status === 503 || response.status === 502
          ? "Your review could not be sent right now and has NOT been received. Please try again later."
          : response.status === 429
            ? "Too many attempts. Please try again later."
            : "Something went wrong and your review was NOT sent. Please try again.",
      );
      trackEvent("form_error", { form_id: "review", error_category: `http_${response.status}` });
    } catch {
      setBanner("We could not reach the server, so your review was NOT sent. Check your connection and try again.");
      trackEvent("form_error", { form_id: "review", error_category: "network" });
    } finally {
      window.clearTimeout(timer);
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const onText =
    (field: ReviewFieldName) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      update(field, e.target.value);

  if (sent) {
    return (
      <div className="text-center" role="status">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-success">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="heading-3 mt-4">Thank you for your review</h3>
        <p className="mt-2 text-ink-2">
          It has been sent to RM Electronics for approval. Reviews appear on the website only after they have been checked.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" className={buttonClasses("primary")} onClick={onDone}>
            Close
          </button>
          <button type="button" className={buttonClasses("secondary")} onClick={() => setSent(false)}>
            Write another review
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={submitting} className="space-y-4">
      {banner ? (
        <div role="alert" className="rounded-control border border-danger bg-[#fef2f2] p-3.5 text-sm font-medium text-ink">
          <p className="flex items-start gap-2">
            <Icon name="alert" className="mt-0.5 h-5 w-5 text-danger" />
            <span>{banner}</span>
          </p>
          <p className="mt-2 pl-7 font-normal">
            Prefer to call?{" "}
            <CallLink placement="review_error" className="text-link font-semibold">
              {BUSINESS.phone.display}
            </CallLink>
          </p>
        </div>
      ) : null}

      <TextField
        id={idFor("name")}
        label="Your name"
        required
        hint="A first name is fine. It may be shown with your review."
        autoComplete="given-name"
        value={values.name}
        onChange={onText("name")}
        onBlur={() => validateOne("name")}
        error={errors.name}
        data-autofocus
      />

      <fieldset aria-describedby={`${idFor("rating")}-hint`} className="min-w-0">
        <legend className="mb-1.5 text-sm font-semibold text-ink">
          Your rating <span className="text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="flex gap-2" role="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="relative">
              <input
                id={`${idFor("rating")}-${n}`}
                type="radio"
                name={`${uid}-rating`}
                value={String(n)}
                checked={values.rating === String(n)}
                onChange={() => update("rating", String(n))}
                className="peer sr-only"
              />
              <span className="inline-flex h-12 w-12 cursor-pointer items-center justify-center gap-0.5 rounded-control border-2 border-[#9ca3af] bg-white text-base font-bold text-brand peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-info">
                {n}
                <span className="sr-only"> out of 5</span>
              </span>
            </label>
          ))}
        </div>
        <p id={`${idFor("rating")}-hint`} className="mt-1.5 text-sm text-muted">
          1 is poor, 5 is excellent.
        </p>
        {errors.rating ? (
          <p className="mt-1 text-sm font-medium text-danger">
            <span className="font-semibold">Error: </span>
            {errors.rating}
          </p>
        ) : null}
      </fieldset>

      <TextAreaField
        id={idFor("text")}
        label="Your review"
        required
        hint={`${REVIEW_LIMITS.textMin} to ${REVIEW_LIMITS.textMax} characters. Please do not include phone numbers, addresses or links.`}
        maxLength={REVIEW_LIMITS.textMax}
        value={values.text}
        onChange={onText("text")}
        onBlur={() => validateOne("text")}
        error={errors.text}
      />
      <TextField
        id={idFor("area")}
        label="Your area"
        placeholder="For example, Nagole"
        maxLength={REVIEW_LIMITS.areaMax}
        value={values.area}
        onChange={onText("area")}
        onBlur={() => validateOne("area")}
        error={errors.area}
      />
      <SelectField id={idFor("brand")} label="TV brand" value={values.brand} onChange={onText("brand")} error={errors.brand}>
        <option value="">Not sure / prefer not to say</option>
        {BRAND_OPTIONS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </SelectField>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={idFor("permission")}
            type="checkbox"
            checked={values.permission}
            onChange={(e) => update("permission", e.target.checked)}
            aria-required="true"
            aria-invalid={errors.permission ? true : undefined}
            aria-describedby={errors.permission ? `${idFor("permission")}-error` : undefined}
            className="mt-0.5 h-6 w-6 shrink-0 rounded border-[#9ca3af] accent-brand"
          />
          <label htmlFor={idFor("permission")} className="text-sm leading-snug text-ink-2">
            I confirm this is my own honest review of a real experience with RM Electronics, and I allow it to be published with my name
            and area if it is approved. See the{" "}
            <Link href="/privacy-policy" target="_blank" rel="noopener" className="text-link">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.permission ? (
          <p id={`${idFor("permission")}-error`} className="mt-1.5 text-sm font-medium text-danger">
            <span className="font-semibold">Error: </span>
            {errors.permission}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={submitting} className={buttonClasses("primary", "lg", "w-full")}>
        {submitting ? "Sending your review..." : "Send review for approval"}
      </button>
    </form>
  );
}
