"use client";

import { CallLink } from "@/components/analytics/ContactLinks";
import { buttonClasses } from "@/components/ui/button-styles";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section">
      <div className="container-page max-w-2xl text-center">
        <h1 className="heading-1">Something went wrong</h1>
        <p className="lead mt-4">
          Sorry, this page could not be shown. You can try again, or call RM Electronics directly.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonClasses("primary", "lg")}>
            Try again
          </button>
          <CallLink placement="error_page" asButton variant="secondary" size="lg" />
        </div>
      </div>
    </section>
  );
}
